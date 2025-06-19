const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The action performed (e.g., create, update, delete, login, etc.)',
      },
      entityType: {
        type: DataTypes.STRING,
        field: 'entity_type',
        comment: 'The type of entity affected (e.g., User, Event, Guest)',
      },
      entityId: {
        type: DataTypes.STRING,
        field: 'entity_id',
        comment: 'The ID of the affected entity',
      },
      oldValues: {
        type: DataTypes.JSON,
        field: 'old_values',
        comment: 'The values before the change (for updates)',
      },
      newValues: {
        type: DataTypes.JSON,
        field: 'new_values',
        comment: 'The values after the change',
      },
      ipAddress: {
        type: DataTypes.STRING,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.TEXT,
        field: 'user_agent',
      },
      metadata: {
        type: DataTypes.JSON,
        comment: 'Additional metadata about the action',
      },
    },
    {
      tableName: 'audit_logs',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['user_id'],
        },
        {
          fields: ['action'],
        },
        {
          fields: ['entity_type', 'entity_id'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  // Define associations
  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return AuditLog;
};
