import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDatabase() {
  if (!env.mongoUri) throw new Error('MONGO_URI is not configured. Add it to Flex-backend/.env.')
  mongoose.set('strictQuery', true)
  const connectionUris = [...new Set([env.mongoUri, env.mongoDirectUri].filter(Boolean))]
  let lastError
  for (const uri of connectionUris) {
    try {
      await mongoose.connect(uri)
      console.log('MongoDB connected')
      return
    } catch (error) {
      lastError = error
      await mongoose.disconnect().catch(() => {})
    }
  }
  throw lastError
}
