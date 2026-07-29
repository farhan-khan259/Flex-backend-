import { User } from '../models/User.js'
import { sendPasswordResetEmail, sendWelcomeEmail } from '../services/mailService.js'
import { clearAuthCookie, createResetToken, hashResetToken, setAuthCookie, signAuthToken } from '../services/tokenService.js'
import { AppError } from '../utils/AppError.js'
import { normalizeEmail, requireEmail, requirePassword, requireText } from '../utils/validation.js'
import { env } from '../config/env.js'

function authenticatedResponse(res, user, status = 200) {
  setAuthCookie(res, signAuthToken(user.id))
  return res.status(status).json({ success: true, user: user.toPublicJSON() })
}

export async function register(req, res) {
  const name = requireText(req.body.name, 'Name', { min: 2, max: 80 })
  const email = requireEmail(req.body.email)
  const password = requirePassword(req.body.password)
  if (await User.exists({ email })) throw new AppError('An account with that email already exists.', 409, 'EMAIL_IN_USE')
  const user = await User.create({ name, email, password })
  sendWelcomeEmail(user).catch((error) => console.error('Welcome email failed:', error.message))
  return authenticatedResponse(res, user, 201)
}

export async function login(req, res) {
  const email = requireEmail(req.body.email)
  const password = String(req.body.password || '')
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) throw new AppError('The email or password is incorrect.', 401, 'INVALID_CREDENTIALS')
  user.lastLoginAt = new Date()
  await user.save({ validateBeforeSave: false })
  return authenticatedResponse(res, user)
}

export function logout(_req, res) {
  clearAuthCookie(res)
  res.json({ success: true, message: 'Signed out.' })
}

export function me(req, res) {
  res.json({ success: true, user: req.user.toPublicJSON() })
}

export async function updateProfile(req, res) {
  if (req.body.name !== undefined) req.user.name = requireText(req.body.name, 'Name', { min: 2, max: 80 })
  if (req.body.email !== undefined) {
    const email = requireEmail(req.body.email)
    const owner = await User.findOne({ email, _id: { $ne: req.user.id } })
    if (owner) throw new AppError('An account with that email already exists.', 409, 'EMAIL_IN_USE')
    req.user.email = email
  }
  await req.user.save()
  res.json({ success: true, user: req.user.toPublicJSON() })
}

export async function forgotPassword(req, res) {
  const email = normalizeEmail(req.body.email)
  const generic = { success: true, message: 'If an account exists for that email, a reset link has been sent.' }
  if (!email) return res.json(generic)
  const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires')
  if (!user) return res.json(generic)

  const { token, hash } = createResetToken()
  user.resetPasswordToken = hash
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
  await user.save({ validateBeforeSave: false })
  const resetUrl = `${env.clientUrls[0].replace(/\/$/, '')}/reset-password/${token}`
  try {
    await sendPasswordResetEmail(user, resetUrl)
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save({ validateBeforeSave: false })
    throw error
  }
  res.json(generic)
}

export async function resetPassword(req, res) {
  const password = requirePassword(req.body.password)
  const tokenHash = hashResetToken(String(req.params.token || ''))
  const user = await User.findOne({ resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: new Date() } }).select('+resetPasswordToken +resetPasswordExpires')
  if (!user) throw new AppError('This reset link is invalid or has expired.', 400, 'INVALID_RESET_TOKEN')
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()
  return authenticatedResponse(res, user)
}
