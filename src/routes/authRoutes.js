import { Router } from 'express'
import { forgotPassword, login, logout, me, register, resetPassword, updateProfile } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimits.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const authRouter = Router()
authRouter.post('/register', authLimiter, asyncHandler(register))
authRouter.post('/login', authLimiter, asyncHandler(login))
authRouter.post('/logout', logout)
authRouter.get('/me', requireAuth, me)
authRouter.patch('/profile', requireAuth, asyncHandler(updateProfile))
authRouter.post('/forgot-password', passwordResetLimiter, asyncHandler(forgotPassword))
authRouter.post('/reset-password/:token', passwordResetLimiter, asyncHandler(resetPassword))
