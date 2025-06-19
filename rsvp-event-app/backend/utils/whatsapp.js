const twilio = require('twilio');
const logger = require('./logger');

// Initialize Twilio client
let twilioClient;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} else {
  logger.warn('Twilio credentials not found. WhatsApp functionality will be disabled.');
}

// WhatsApp sender ID (must be a Twilio WhatsApp-enabled number in E.164 format)
const WHATSAPP_SENDER = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || ''}`;

/**
 * Send a WhatsApp message
 * @param {string} to - Recipient phone number in E.164 format (e.g., '+1234567890')
 * @param {string} message - Message content
 * @param {Array} [mediaUrls] - Array of media URLs to include in the message
 * @returns {Promise<Object>} - Result of the WhatsApp message sending operation
 */
const sendWhatsAppMessage = async (to, message, mediaUrls = []) => {
  if (!twilioClient) {
    throw new Error('Twilio client is not configured');
  }

  if (!to.startsWith('whatsapp:')) {
    to = `whatsapp:${to}`;
  }

  try {
    const payload = {
      body: message,
      from: WHATSAPP_SENDER,
      to,
    };

    // Add media URL if provided (only the first URL is used in the free tier)
    if (mediaUrls.length > 0) {
      payload.mediaUrl = mediaUrls[0];
    }

    const result = await twilioClient.messages.create(payload);

    logger.info(`WhatsApp message sent to ${to}: ${result.sid}`);

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
    };
  } catch (error) {
    logger.error('Error sending WhatsApp message:', error);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

/**
 * Send an event invitation via WhatsApp
 * @param {string} phoneNumber - Recipient phone number
 * @param {Object} event - Event details
 * @param {string} rsvpLink - Link to RSVP for the event
 * @returns {Promise<Object>} - Result of the WhatsApp message
 */
const sendEventInvitation = async (phoneNumber, event, rsvpLink) => {
  const message = `*${event.name}*\n\n` +
    `📅 ${new Date(event.startDate).toLocaleDateString()}\n` +
    `📍 ${event.location}\n\n` +
    `${event.description}\n\n` +
    `🎟️ RSVP here: ${rsvpLink}`;

  return sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Send a verification code via WhatsApp
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} code - Verification code
 * @returns {Promise<Object>} - Result of the verification message
 */
const sendVerificationCode = async (phoneNumber, code) => {
  const message = `Your verification code is: *${code}*\n\n` +
    `This code will expire in 10 minutes.`;
    
  return sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Send an event reminder via WhatsApp
 * @param {string} phoneNumber - Recipient phone number
 * @param {Object} event - Event details
 * @param {string} rsvpLink - Link to RSVP for the event
 * @returns {Promise<Object>} - Result of the reminder message
 */
const sendEventReminder = async (phoneNumber, event, rsvpLink) => {
  const message = `🔔 *Reminder: ${event.name}*\n\n` +
    `📅 When: ${new Date(event.startDate).toLocaleString()}\n` +
    `📍 Where: ${event.location}\n\n` +
    `📝 RSVP: ${rsvpLink}`;

  return sendWhatsAppMessage(phoneNumber, message);
};

module.exports = {
  sendWhatsAppMessage,
  sendEventInvitation,
  sendVerificationCode,
  sendEventReminder,
};
