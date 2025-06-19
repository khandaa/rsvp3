const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        field: 'event_id',
        references: {
          model: 'events',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      templateId: {
        type: DataTypes.INTEGER,
        field: 'template_id',
        references: {
          model: 'notification_templates',
          key: 'id',
        },
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('draft', 'scheduled', 'sending', 'sent', 'failed'),
        defaultValue: 'draft',
      },
      scheduledAt: {
        type: DataTypes.DATE,
        field: 'scheduled_at',
      },
      sentAt: {
        type: DataTypes.DATE,
        field: 'sent_at',
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by',
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['status'],
        },
        {
          fields: ['scheduled_at'],
        },
      ],
    }
  );

  // Define associations
  Notification.associate = (models) => {
    Notification.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });

    Notification.belongsTo(models.NotificationTemplate, {
      foreignKey: 'template_id',
      as: 'template',
    });

    Notification.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });

    Notification.hasMany(models.NotificationRecipient, {
      foreignKey: 'notification_id',
      as: 'recipients',
    });
  };

  return Notification;
};
