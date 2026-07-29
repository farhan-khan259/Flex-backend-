import { AppError } from '../utils/AppError.js'
import { User } from '../models/User.js'

function optionalText(value, maxLength) {
  if (value === null || value === undefined || value === '') return null
  const text = String(value).trim()
  if (text.length > maxLength) throw new AppError('Saved product option is invalid.', 400, 'VALIDATION_ERROR')
  return text
}

function parseProductId(value) {
  const productId = Number(value)
  if (!Number.isSafeInteger(productId) || productId < 1) throw new AppError('Product ID is invalid.', 400, 'VALIDATION_ERROR')
  return productId
}

function sanitizeCart(items) {
  if (!Array.isArray(items) || items.length > 100) throw new AppError('Cart data is invalid.', 400, 'VALIDATION_ERROR')
  const unique = new Map()
  for (const item of items) {
    const clean = {
      productId: parseProductId(item.productId),
      quantity: Math.min(99, Math.max(1, Number.parseInt(item.quantity, 10) || 1)),
      size: optionalText(item.size, 30),
      color: optionalText(item.color, 30),
      offerId: optionalText(item.offerId, 60),
    }
    unique.set(`${clean.productId}|${clean.size}|${clean.color}|${clean.offerId}`, clean)
  }
  return [...unique.values()]
}

function sanitizeWishlist(items) {
  if (!Array.isArray(items) || items.length > 100) throw new AppError('Wishlist data is invalid.', 400, 'VALIDATION_ERROR')
  return [...new Set(items.map(parseProductId))]
}

export function getCart(req, res) {
  res.json({ success: true, cart: req.user.cart || [] })
}

export async function replaceCart(req, res) {
  const cart = sanitizeCart(req.body.cart)
  await User.updateOne({ _id: req.user.id }, { $set: { cart } }, { runValidators: true })
  res.json({ success: true, cart })
}

export function getWishlist(req, res) {
  res.json({ success: true, wishlist: req.user.wishlist || [] })
}

export async function replaceWishlist(req, res) {
  const wishlist = sanitizeWishlist(req.body.wishlist)
  await User.updateOne({ _id: req.user.id }, { $set: { wishlist } }, { runValidators: true })
  res.json({ success: true, wishlist })
}
