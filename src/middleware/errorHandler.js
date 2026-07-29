export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  error.statusCode = 404
  error.code = 'NOT_FOUND'
  next(error)
}

export function errorHandler(error, _req, res, _next) {
  let status = error.statusCode || 500
  let message = error.message || 'Something went wrong.'
  let code = error.code || 'INTERNAL_ERROR'

  if (error.name === 'ValidationError') {
    status = 400
    code = 'VALIDATION_ERROR'
    message = Object.values(error.errors).map((item) => item.message).join(' ')
  }
  if (error.code === 11000) {
    status = 409
    code = 'EMAIL_IN_USE'
    message = 'An account with that email already exists.'
  }

  if (status >= 500) console.error(error)
  res.status(status).json({ success: false, error: { code, message, ...(error.details && { details: error.details }) } })
}
