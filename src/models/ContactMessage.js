import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ['received', 'emailed', 'email_failed'], default: 'received' },
  mailError: { type: String, select: false },
}, { timestamps: true })

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)
