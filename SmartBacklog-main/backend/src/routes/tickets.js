import { Router } from 'express'
import { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket } from '../controllers/ticketController.js'
import { generalLimiter } from '../middleware/rateLimiter.js'

export const ticketRouter = Router()

ticketRouter.use(generalLimiter)

ticketRouter.get('/',       getAllTickets)
ticketRouter.get('/:id',    getTicketById)
ticketRouter.post('/',      createTicket)
ticketRouter.put('/:id',    updateTicket)
ticketRouter.delete('/:id', deleteTicket)