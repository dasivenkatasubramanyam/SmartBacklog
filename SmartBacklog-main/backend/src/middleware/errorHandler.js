export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  console.error(`[Error] ${req.method} ${req.path} — ${status}: ${message}`)

  res.status(status).json({ error: message })
}