import { app } from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'

async function start() {
  await connectDatabase()
  const server = app.listen(env.port, () => console.log(`FLEX API listening on port ${env.port}`))

  const shutdown = (signal) => {
    console.log(`${signal} received; closing server`)
    server.close(() => process.exit(0))
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

start().catch((error) => {
  console.error('FLEX API failed to start:', error.message)
  process.exit(1)
})
