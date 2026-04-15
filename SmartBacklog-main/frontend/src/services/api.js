import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

export const ticketService = {
  getAll: async () => {
    const { data } = await api.get('/tickets')
    return data
  },
  create: async (ticket) => {
    const { data } = await api.post('/tickets', ticket)
    return data
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/tickets/${id}`, updates)
    return data
  },
  delete: async (id) => {
    await api.delete(`/tickets/${id}`)
  }
}

export const aiService = {
  analyze: async ({ title, description }) => {
    const { data } = await api.post('/ai/analyze', { title, description })
    return data
  }
}

export default api