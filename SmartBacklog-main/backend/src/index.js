import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { ticketRouter } from './routes/tickets.js'
import { aiRouter } from './routes/ai.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(morgan('dev'))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/tickets', ticketRouter)
app.use('/api/ai', aiRouter)

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🚀 SmartBacklog API running on http://localhost:${PORT}`)
  console.log(`   OpenAI key: ${process.env.OPENAI_API_KEY ? '✓ loaded' : '✗ missing'}\n`)
})