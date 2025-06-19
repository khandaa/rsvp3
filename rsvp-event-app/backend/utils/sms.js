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
  logger.warn('Twilio credentials not found. SMS functionality will be disabled.');
}

/**
 * Send an SMS message
 * @param {string} to - Recipient phone number (E.164 format: +1234567890)
 * @param {string} message - Message content
 * @param {string} [from] - Sender phone number (defaults to TWILIO_PHONE_NUMBER)
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
const sendSMS = async (to, message, from = process.env.TWILIO_PHONE_NUMBER) => {
  if (!twilioClient) {
    throw new Error('Twilio client is not configured');
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      to,
      from,
    });

    logger.info(`SMS sent to ${to}: ${result.sid}`);

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
    };
  } catch (error) {
    logger.error('Error sending SMS:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Send a verification code via SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} code - Verification code
 * @returns {Promise<Object>} - Result of the verification SMS
 */
const sendVerificationCode = async (phoneNumber, code) => {
  const message = `Your verification code is: ${code}. Valid for 10 minutes.`;
  return sendSMS(phoneNumber, message);
};

/**
 * Send an event reminder via SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {Object} event - Event details
 * @param {string} rsvpLink - Link to RSVP for the event
 * @returns {Promise<Object>} - Result of the reminder SMS
 */
const sendEventReminder = async (phoneNumber, event, rsvpLink) => {
  const message = `Reminder: ${event.name} is coming up on ${new Date(
    event.startDate
  ).toLocaleDateString()} at ${event.location}. RSVP: ${rsvpLink}`;

  return sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendVerificationCode,
  sendEventReminder,
};
