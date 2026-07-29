import { ContactMessage } from '../models/ContactMessage.js'
import { sendContactEmails } from '../services/mailService.js'
import { requireEmail, requireText } from '../utils/validation.js'

export async function createContact(req, res) {
  const contact = await ContactMessage.create({
    name: requireText(req.body.name, 'Name', { min: 2, max: 80 }),
    email: requireEmail(req.body.email),
    message: requireText(req.body.message, 'Message', { min: 10, max: 5000 }),
  })

  try {
    await sendContactEmails(contact)
    contact.status = 'emailed'
  } catch (error) {
    contact.status = 'email_failed'
    contact.mailError = error.message
    await contact.save()
    throw error
  }
  await contact.save()
  res.status(201).json({ success: true, message: 'Thanks — your message has been sent.' })
}
