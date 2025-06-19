const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const logger = require('./logger');

/**
 * Generate a random token string
 * @param {number} length - Length of the token
 * @returns {string} - Random token string
 */
const generateRandomToken = (length = 32) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, length); // return required number of characters
};

/**
 * Generate JWT token
 * @param {Object} payload - Data to include in the token
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d')
 * @returns {string} - JWT token
 */
const generateJwtToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('JWT verification failed:', error.message);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate a secure token for email verification, password reset, etc.
 * @param {Object} user - User object
 * @param {string} type - Type of token (e.g., 'verify-email', 'reset-password')
 * @param {string} expiresIn - Expiration time (default: '1h')
 * @returns {string} - Generated token
 */
const generateSecureToken = (user, type, expiresIn = '1h') => {
  const payload = {
    userId: user.id,
    email: user.email,
    type,
  };

  return generateJwtToken(payload, expiresIn);
};

/**
 * Generate a secure token for RSVP responses
 * @param {Object} rsvp - RSVP object
 * @returns {string} - Generated token
 */
const generateRsvpToken = (rsvp) => {
  const payload = {
    rsvpId: rsvp.id,
    eventId: rsvp.eventId,
    guestId: rsvp.guestId,
    type: 'rsvp',
  };

  // RSVP tokens typically don't expire or have a long expiration
  return generateJwtToken(payload, '30d');
};

/**
 * Generate a secure API key
 * @param {string} prefix - Prefix for the API key (e.g., 'sk_' for secret key)
 * @returns {string} - Generated API key
 */
const generateApiKey = (prefix = 'sk_') => {
  const randomPart = crypto.randomBytes(32).toString('hex');
  return `${prefix}${randomPart}`;
};

/**
 * Hash a string using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} - Hashed string
 */
const hashString = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  generateRandomToken,
  generateJwtToken,
  verifyJwtToken,
  generateSecureToken,
  generateRsvpToken,
  generateApiKey,
  hashString,
};
