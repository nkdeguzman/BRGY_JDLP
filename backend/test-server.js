// Simple test to check backend startup
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend test - Server is running!')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`)
  console.log('Backend dependencies loaded successfully!')
})
