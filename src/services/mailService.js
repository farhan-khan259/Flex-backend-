import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

let transporter

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function getTransporter() {
  if (!env.smtp.user || !env.smtp.pass) {
    throw new AppError('Email service is not configured yet.', 503, 'SMTP_NOT_CONFIGURED')
  }
  transporter ||= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  })
  return transporter
}

function shell(content) {
  return `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172117"><div style="padding:22px;background:#131a14;color:#fff;font-size:24px;font-weight:800">FLEX</div><div style="padding:30px;border:1px solid #d7ddd5">${content}</div></div>`
}

async function sendMail(options) {
  return getTransporter().sendMail({ from: env.smtp.from, ...options })
}

export function sendWelcomeEmail(user) {
  return sendMail({
    to: user.email,
    subject: 'Welcome to FLEX',
    html: shell(`<h1>Welcome, ${escapeHtml(user.name)}.</h1><p>Your FLEX account is ready.</p>`),
    text: `Welcome, ${user.name}. Your FLEX account is ready.`,
  })
}

export function sendPasswordResetEmail(user, resetUrl) {
  return sendMail({
    to: user.email,
    subject: 'Reset your FLEX password',
    html: shell(`<h1>Reset your password</h1><p>This link expires in one hour.</p><p><a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:14px 20px;background:#172117;color:#fff;text-decoration:none">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`),
    text: `Reset your FLEX password within one hour: ${resetUrl}\n\nIf you did not request this, ignore this email.`,
  })
}

export async function sendContactEmails(contact) {
  await sendMail({
    to: env.contactTo,
    replyTo: contact.email,
    subject: `FLEX contact form: ${contact.name}`,
    html: shell(`<h1>New contact message</h1><p><strong>From:</strong> ${escapeHtml(contact.name)} (${escapeHtml(contact.email)})</p><p style="white-space:pre-wrap">${escapeHtml(contact.message)}</p>`),
    text: `From: ${contact.name} <${contact.email}>\n\n${contact.message}`,
  })
  await sendMail({
    to: contact.email,
    subject: 'We received your FLEX message',
    html: shell(`<h1>Thanks, ${escapeHtml(contact.name)}.</h1><p>We received your message and will get back to you as soon as possible.</p>`),
    text: `Thanks, ${contact.name}. We received your message and will get back to you as soon as possible.`,
  })
}
