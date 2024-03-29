const express = require('express')
const mockData = require('./mock_data.json')
const brandDetails = require('./brand_mapping.json')
const cors = require('cors')
const axios = require('axios')

const app = express()
const fs = require('fs')
app.use(cors())
app.use(express.json())

app.get('/locations/all', (req, res) => {
    res.json(mockData)
})

// endpoint takes in (long, lat, radius) => returns array of locations within radius
app.get('/locations/nearby', (req, res) => {
    const query = req.query
    const { lng, lat, radius } = query
    const pi = Math.PI
    const longRadian = lng * (pi / 180)
    const latRadian = lat * (pi / 180)
    if (!lng || !lat || !radius) {
        res.status(400).json({
            error: 'Invalid query',
        })
    }
    let result = mockData
        .filter((location) => {
            const distance =
                6371 *
                Math.acos(
                    Math.sin(latRadian) * Math.sin(location.latitude) +
                        Math.cos(latRadian) *
                            Math.cos(location.latitude) *
                            Math.cos(location.longitude - longRadian)
                )
            if (distance <= radius) {
                console.log(location.app_id)
            }
            return (
                distance <= radius ||
                (location.latitude === latRadian &&
                    location.longitude === longRadian)
            )
        })
        .map((el) => ({ ...el }))
    result.forEach((location) => {
        location.longitude = location.longitude * (180 / pi)
        location.latitude = location.latitude * (180 / pi)
    })
    return res.json(result)
})

app.get('/brand-details/:brand_id', (req, res) => {
    const { brand_id } = req.params
    res.json(brandDetails[brand_id])
})

app.get('/generate-reviews/', (req, res) => {
    if (!req.query.brand_id) {
        res.status(400).json({
            error: 'Invalid query',
        })
    }
    const location_array = mockData.filter((location) => {
        return (
            location.brand_id === req.query.brand_id &&
            location.available === 'available'
        )
    })
    let temp = location_array.map((location => {
        return axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude * (180 / Math.PI)},${location.longitude * (180 / Math.PI)}&name=George%20Lopez%20Tacos&key=${process.env.VITE_APP_GOOGLE_API_KEY}&radius=100`)
        .then(response => {
            if (response.data && response.data.results && response.data.results.length > 0)
                return {result: response.data.results[0], app_id: location.app_id};
        })
    }))
    Promise.all(temp).then(data => {
        console.log(data);
        const nonNull = data.filter(el => el);
        fs.writeFileSync('./mock_server/review.json', JSON.stringify({nonNull}));
    });
});

app.get('/reviews', async (req, res) => {
    console.log(req.query)
    if (!req.query.app_id) {
        res.status(400).json({
            error: 'Invalid query',
        })
    }

    const reviews = require('./review.json')
    res.send(reviews.nonNull.filter((el) => el.app_id === req.query.app_id))
})

app.get('/getDetails', async (req, res) => {
    const { place_id } = req.query
    console.log('In reviews:', place_id)
    try {
        if (!place_id) {
            res.status(400).json({
                error: 'Invalid query',
            })
        }
        // Need to add key here, process.env does not work
        const apiKey = process.env.VITE_APP_GOOGLE_API_KEY
        // const apiKey = ''

        const result = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Crating%2Creview&place_id=${place_id}=${apiKey}`
        )
        console.log('review results', result.data)
        res.send(result.data)
    } catch (err) {
        console.log('Error loading reviews', err)
    }
})

app.listen(8080, () => {
    console.log('Server is running on port', 8080)
})
