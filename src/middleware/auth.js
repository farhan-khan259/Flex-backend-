import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { verifyAuthToken } from '../services/tokenService.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies[env.cookieName]
  if (!token) throw new AppError('Please sign in to continue.', 401, 'AUTH_REQUIRED')

  let payload
  try { payload = verifyAuthToken(token) } catch { throw new AppError('Your session has expired. Please sign in again.', 401, 'INVALID_SESSION') }
  const user = await User.findById(payload.sub)
  if (!user) throw new AppError('Your session is no longer valid.', 401, 'INVALID_SESSION')
  req.user = user
  next()
})
