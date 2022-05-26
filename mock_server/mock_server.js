const express = require('express')
const mockData = require('./mock_data.json')
const brandDetails = require('./brand_mapping.json')
const cors = require('cors')

const app = express()
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
    let result = mockData.filter((location) => {
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
        return distance <= radius || (location.latitude === latRadian && location.longitude === longRadian);
    }).map(el => ({...el}));;
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

app.listen(8080, () => {
    console.log('Server is running on port', 8080)
})
