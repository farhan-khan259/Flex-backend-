import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { authRouter } from './routes/authRoutes.js'
import { contactRouter } from './routes/contactRoutes.js'

export const app = express()
app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || env.clientUrls.includes(origin)) return callback(null, true)
    return callback(new Error('Origin not allowed by CORS'))
  },
}))
app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: false, limit: '20kb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => res.json({ success: true, service: 'flex-api' }))
app.use('/api/auth', authRouter)
app.use('/api/contact', contactRouter)
app.use(notFound)
app.use(errorHandler)
