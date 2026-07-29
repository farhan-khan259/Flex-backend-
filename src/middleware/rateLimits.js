import { rateLimit } from 'express-rate-limit'

const response = { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } }

export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message: response })
export const passwordResetLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: response })
export const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: response })
