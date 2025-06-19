const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventGuest = sequelize.define(
    'EventGuest',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'event_id',
        references: {
          model: 'events',
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
      invitationSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'invitation_sent',
      },
      invitationSentAt: {
        type: DataTypes.DATE,
        field: 'invitation_sent_at',
      },
      invitationMethod: {
        type: DataTypes.ENUM('email', 'sms', 'whatsapp', 'postal', 'other'),
        field: 'invitation_method',
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_confirmed',
      },
      confirmedAt: {
        type: DataTypes.DATE,
        field: 'confirmed_at',
      },
      notes: {
        type: DataTypes.TEXT,
      },
      tableNumber: {
        type: DataTypes.STRING,
        field: 'table_number',
      },
      seatNumber: {
        type: DataTypes.STRING,
        field: 'seat_number',
      },
      checkInTime: {
        type: DataTypes.DATE,
        field: 'check_in_time',
      },
      checkOutTime: {
        type: DataTypes.DATE,
        field: 'check_out_time',
      },
    },
    {
      tableName: 'event_guests',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['event_id', 'guest_id'],
        },
        {
          fields: ['is_confirmed'],
        },
        {
          fields: ['invitation_sent'],
        },
      ],
    }
  );

  // Define associations
  EventGuest.associate = (models) => {
    EventGuest.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });

    EventGuest.belongsTo(models.Guest, {
      foreignKey: 'guest_id',
      as: 'guest',
    });
  };

  return EventGuest;
};
