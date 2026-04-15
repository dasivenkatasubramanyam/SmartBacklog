import React, { createContext, useContext, useState, useCallback } from 'react'

const BoardContext = createContext(null)

const INITIAL_TICKETS = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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

export function BoardProvider({ children }) {
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const [defaultColumn, setDefaultColumn] = useState('todo')

  const addTicket = useCallback((ticket) => {
    setTickets(prev => [...prev, {
      ...ticket,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }])
  }, [])

  const updateTicket = useCallback((id, updates) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const deleteTicket = useCallback((id) => {
    setTickets(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTicket = useCallback((id, column) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, column } : t))
  }, [])

  const openNewModal = useCallback((col = 'todo') => {
    setEditingTicket(null)
    setDefaultColumn(col)
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((ticket) => {
    setEditingTicket(ticket)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setEditingTicket(null)
  }, [])

  return (
    <BoardContext.Provider value={{
      tickets,
      addTicket,
      updateTicket,
      deleteTicket,
      moveTicket,
      modalOpen,
      editingTicket,
      defaultColumn,
      openNewModal,
      openEditModal,
      closeModal
    }}>
      {children}
    </BoardContext.Provider>
  )
}

export const useBoard = () => {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be inside BoardProvider')
  return ctx
}