const { AuditLog } = require('../models');

// Log actions to the audit log
const auditLogger = (action, entityType) => {
  return async (req, res, next) => {
    // Skip logging for non-mutating methods or if user is not authenticated
    if (req.method === 'GET' || !req.user) {
      return next();
    }

    // Get the entity ID from params or body
    const entityId = req.params.id || req.body.id;

    // Get the old values for update actions
    let oldValues = {};
    if (req.method === 'PUT' || req.method === 'PATCH') {
      // You would typically fetch the existing record here
      // For example: oldValues = await Model.findByPk(entityId);
    }

    // Create audit log entry
    await AuditLog.create({
      userId: req.user.id,
      action,
      entityType,
      entityId,
      oldValues: Object.keys(oldValues).length > 0 ? oldValues : undefined,
      newValues: req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    next();
  };
};

// Middleware to log API requests
const apiLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, body, params, query, user } = req;

  // Log request details
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
  if (Object.keys(params).length > 0) {
    console.log('Params:', params);
  }
  if (Object.keys(query).length > 0) {
    console.log('Query:', query);
  }
  if (Object.keys(body).length > 0) {
    console.log('Body:', body);
  }
  if (user) {
    console.log('User:', user.id);
  }

  // Capture response finish to log duration
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = {
  auditLogger,
  apiLogger,
};
