const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NotificationRecipient = sequelize.define(
    'NotificationRecipient',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      notificationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'notification_id',
        references: {
          model: 'notifications',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      guestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'guest_id',
        references: {
          model: 'guests',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      channel: {
        type: DataTypes.ENUM('email', 'sms', 'whatsapp', 'push'),
        allowNull: false,
      },
      recipientAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'recipient_address',
        comment: 'Email address, phone number, or other contact method',
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'sending',
          'sent',
          'delivered',
          'read',
          'failed'
        ),
        defaultValue: 'pending',
      },
      sentAt: {
        type: DataTypes.DATE,
        field: 'sent_at',
      },
      deliveredAt: {
        type: DataTypes.DATE,
        field: 'delivered_at',
      },
      readAt: {
        type: DataTypes.DATE,
        field: 'read_at',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        field: 'error_message',
      },
      metadata: {
        type: DataTypes.JSON,
        comment: 'Additional metadata about the delivery',
      },
    },
    {
      tableName: 'notification_recipients',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['notification_id'],
        },
        {
          fields: ['guest_id'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['channel'],
        },
      ],
    }
  );

  // Define associations
  NotificationRecipient.associate = (models) => {
    NotificationRecipient.belongsTo(models.Notification, {
      foreignKey: 'notification_id',
      as: 'notification',
    });

    NotificationRecipient.belongsTo(models.Guest, {
      foreignKey: 'guest_id',
      as: 'guest',
    });
  };

  return NotificationRecipient;
};
