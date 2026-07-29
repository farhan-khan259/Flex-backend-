import { Router } from 'express'
import { createContact } from '../controllers/contactController.js'
import { contactLimiter } from '../middleware/rateLimits.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const contactRouter = Router()
contactRouter.post('/', contactLimiter, asyncHandler(createContact))
