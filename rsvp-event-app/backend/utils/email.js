const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

// Create a transporter object - use ethereal for development or console logging as fallback
let transporter;

if (process.env.NODE_ENV === 'development') {
  if (process.env.USE_CONSOLE_EMAIL === 'true') {
    // Mock transporter for development that logs to console
    transporter = {
      sendMail: (mailOptions) => {
        logger.info('Development mode: Email not sent');
        logger.info('Email details:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          content: mailOptions.html ? 'HTML content available' : 'No HTML content'
        });
        
        return Promise.resolve({
          messageId: `mock-${Date.now()}`,
          mockEmail: true
        });
      },
      verify: (callback) => callback(null, true)
    };
    
    logger.info('Using console email transport for development');
  } else {
    // Use actual SMTP server if configured
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: process.env.SMTP_PORT || 1025, // Default to mailhog port
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: process.env.SMTP_USERNAME ? {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      } : undefined,
      tls: {
        // Do not fail on invalid certs in development
        rejectUnauthorized: false,
      },
    });
  }
} else {
  // Production email setup
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      // Fail on invalid certs in production
      rejectUnauthorized: true,
    },
  });
}

// Verify connection configuration if not using console transport
if (process.env.NODE_ENV !== 'development' || process.env.USE_CONSOLE_EMAIL !== 'true') {
  transporter.verify((error) => {
    if (error) {
      logger.warn('SMTP connection issue - falling back to console logging:', error);
      // Fall back to console transport if verification fails
      transporter = {
        sendMail: (mailOptions) => {
          logger.info('Fallback mode: Email not sent');
          logger.info('Email details:', {
            to: mailOptions.to,
            subject: mailOptions.subject,
          });
          
          return Promise.resolve({
            messageId: `fallback-${Date.now()}`,
            fallbackEmail: true
          });
        },
        verify: (callback) => callback(null, true)
      };
    } else {
      logger.info('SMTP server is ready to take messages');
    }
  });
}

/**
 * Send an email using a template
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Name of the EJS template file (without .ejs extension)
 * @param {Object} options.templateVars - Variables to pass to the template
 * @param {string} [options.from] - Sender email address (defaults to env var)
 * @param {string} [options.cc] - CC email address(es)
 * @param {string} [options.bcc] - BCC email address(es)
 * @param {Array} [options.attachments] - Email attachments
 * @returns {Promise<Object>} - Result of the sendMail operation
 */
const sendEmail = async ({
  to,
  subject,
  template,
  templateVars = {},
  from = process.env.EMAIL_FROM,
  cc,
  bcc,
  attachments = [],
}) => {
  try {
    // Get the email template
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      'emails',
      `${template}.ejs`
    );

    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template ${template}.ejs not found`);
    }

    // Render the email template with the provided variables
    const html = await ejs.renderFile(templatePath, {
      ...templateVars,
      year: new Date().getFullYear(),
      appName: process.env.APP_NAME || 'RSVP Event App',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    });

    // Setup email data
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'RSVP Event App'}" <${from}>`,
      to,
      subject,
      html,
      cc,
      bcc,
      attachments,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

// Example email templates
const emailTemplates = {
  // Send welcome email
  async sendWelcomeEmail(user, token) {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    
    return sendEmail({
      to: user.email,
      subject: 'Welcome to RSVP Event App',
      template: 'welcome',
      templateVars: {
        name: user.firstName,
        verificationUrl,
      },
    });
  },
  
  // Send password reset email
  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
    
    return sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      templateVars: {
        name: user.firstName,
        resetUrl,
        expiresIn: '1 hour', // Should match token expiration
      },
    });
  },
  
  // Send event invitation
  async sendEventInvitation(guest, event, rsvpToken) {
    const rsvpUrl = `${process.env.APP_URL}/rsvp/${rsvpToken}`;
    
    return sendEmail({
      to: guest.email,
      subject: `You're Invited: ${event.name}`,
      template: 'event-invitation',
      templateVars: {
        guestName: guest.firstName,
        eventName: event.name,
        eventDate: event.startDate,
        eventLocation: event.location,
        rsvpUrl,
        eventDescription: event.description,
      },
    });
  },
};

module.exports = {
  transporter,
  sendEmail,
  ...emailTemplates,
};
