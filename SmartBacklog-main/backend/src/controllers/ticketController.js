import { v4 as uuidv4 } from 'uuid'

// In-memory store
let tickets = [
  {
    id: uuidv4(),
    title: 'User authentication system',
    description: 'As a user, I want to log in with email and password.',
    column: 'todo',
    points: 5,
    priority: 'high',
    criteria: ['Login form', 'Error message', 'Redirect on success'],
    aiGenerated: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Stripe payment integration',
    description: 'As a user, I want to pay via Stripe.',
    column: 'todo',
    points: 8,
    priority: 'blocking',
    criteria: ['Stripe form', 'PCI compliant', 'Webhook'],
    aiGenerated: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Kanban drag and drop',
    description: 'As a PO, I want to drag tickets between columns.',
    column: 'inprogress',
    points: 3,
    priority: 'high',
    criteria: ['Draggable', 'Drop zone', 'Count updates'],
    aiGenerated: true,
    createdAt: new Date().toISOString()
  }
]

export const getAllTickets = (req, res) => {
  const { column, priority } = req.query
  let result = [...tickets]
  if (column) result = result.filter(t => t.column === column)
  if (priority) result = result.filter(t => t.priority === priority)
  res.json({ tickets: result, total: result.length })
}

export const getTicketById = (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id)
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
  res.json(ticket)
}

export const createTicket = (req, res) => {
  const { title, description, column, points, priority, criteria, aiGenerated } = req.body

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' })
  }

  const validColumns = ['todo', 'inprogress', 'done']
  if (column && !validColumns.includes(column)) {
    return res.status(400).json({ error: `column must be one of: ${validColumns.join(', ')}` })
  }

  const ticket = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || '',
    column: column || 'todo',
    points: points || null,
    priority: priority || 'medium',
    criteria: criteria || [],
    aiGenerated: aiGenerated || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  tickets.push(ticket)
  res.status(201).json(ticket)
}

export const updateTicket = (req, res) => {
  const idx = tickets.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Ticket not found' })

  const allowed = ['title', 'description', 'column', 'points', 'priority', 'criteria', 'aiGenerated']
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  )

  tickets[idx] = { ...tickets[idx], ...updates, updatedAt: new Date().toISOString() }
  res.json(tickets[idx])
}

export const deleteTicket = (req, res) => {
  const idx = tickets.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Ticket not found' })
  const deleted = tickets.splice(idx, 1)[0]
  res.json({ message: 'Ticket deleted', id: deleted.id })
}