import { Router } from 'express'
import { getCart, getWishlist, replaceCart, replaceWishlist } from '../controllers/collectionController.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const collectionRouter = Router()
collectionRouter.use(requireAuth)
collectionRouter.get('/cart', getCart)
collectionRouter.put('/cart', asyncHandler(replaceCart))
collectionRouter.get('/wishlist', getWishlist)
collectionRouter.put('/wishlist', asyncHandler(replaceWishlist))
