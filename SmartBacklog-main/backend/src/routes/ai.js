import { Router } from 'express'
import { analyzeTicket } from '../controllers/aiController.js'
import { aiLimiter } from '../middleware/rateLimiter.js'

export const aiRouter = Router()

aiRouter.post('/analyze', aiLimiter, analyzeTicket)