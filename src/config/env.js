import 'dotenv/config'

const requiredInProduction = ['JWT_SECRET']

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

if (process.env.NODE_ENV === 'production' && (process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith('replace_'))) {
  throw new Error('JWT_SECRET must be a unique random value of at least 32 characters in production.')
}

if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI && !process.env.MONGO_URI_DIRECT && !process.env.MONGODB_URI) {
  throw new Error('MONGO_URI or MONGO_URI_DIRECT is required in production.')
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGO_URI || process.env.MONGO_URI_DIRECT || process.env.MONGODB_URI || '',
  mongoDirectUri: process.env.MONGO_URI_DIRECT || '',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-this-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'flex_token',
  // Render needs both custom-domain variants to support credentialed browser requests.
  clientUrls: (process.env.CLIENT_URL || (process.env.NODE_ENV === 'production'
    ? 'https://flexofficial.co.uk,https://www.flexofficial.co.uk'
    : 'http://localhost:3000')).split(',').map((url) => url.trim()),
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'FLEX Official <flexofficial26@gmail.com>',
  },
  contactTo: process.env.CONTACT_TO || 'flexofficial26@gmail.com',
}

export const isProduction = env.nodeEnv === 'production'
