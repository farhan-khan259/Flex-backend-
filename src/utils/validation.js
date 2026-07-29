import { AppError } from './AppError.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function requireEmail(value) {
  const email = normalizeEmail(value)
  if (!emailPattern.test(email) || email.length > 254) {
    throw new AppError('Please enter a valid email address.', 400, 'VALIDATION_ERROR')
  }
  return email
}

export function requireText(value, field, { min = 1, max = 5000 } = {}) {
  const text = String(value || '').trim()
  if (text.length < min || text.length > max) {
    throw new AppError(`${field} must be between ${min} and ${max} characters.`, 400, 'VALIDATION_ERROR')
  }
  return text
}

export function requirePassword(value) {
  const password = String(value || '')
  if (password.length < 8 || password.length > 128 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new AppError('Password must be 8–128 characters and include a letter and a number.', 400, 'VALIDATION_ERROR')
  }
  return password
}
