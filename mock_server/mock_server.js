const express = require('express')
const mockData = require('./mock_data.json')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/locations/all', (req, res) => {
    res.json(mockData)
})

// endpoint takes in (long, lat, radius) => returns array of locations within radius

app.listen(8080, () => {
    console.log('Server is running on port', 8080)
})
