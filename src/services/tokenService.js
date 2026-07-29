import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env, isProduction } from '../config/env.js'

export function signAuthToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn, issuer: 'flex-api', audience: 'flex-storefront' })
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret, { issuer: 'flex-api', audience: 'flex-storefront' })
}

export function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearAuthCookie(res) {
  res.clearCookie(env.cookieName, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' })
}

export function createResetToken() {
  const token = crypto.randomBytes(32).toString('hex')
  return { token, hash: crypto.createHash('sha256').update(token).digest('hex') }
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}
