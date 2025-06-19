const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define(
    'Event',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.ENUM('wedding', 'corporate', 'birthday', 'other'),
        allowNull: false,
        defaultValue: 'wedding',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date',
      },
      timezone: {
        type: DataTypes.STRING,
        defaultValue: 'UTC',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
        defaultValue: 'draft',
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_recurring',
      },
      recurrencePattern: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        field: 'recurrence_pattern',
      },
      maxAttendees: {
        type: DataTypes.INTEGER,
        field: 'max_attendees',
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_private',
      },
      coverImage: {
        type: DataTypes.STRING,
        field: 'cover_image',
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by',
        references: {
          model: 'users', // This is the table name
          key: 'id',
        },
      },
    },
    {
      tableName: 'events',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['start_date'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['type'],
        },
      ],
    }
  );

  // Define associations
  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'organizer',
    });

    Event.hasMany(models.EventVenue, {
      foreignKey: 'event_id',
      as: 'venues',
    });

    Event.hasMany(models.EventGuest, {
      foreignKey: 'event_id',
      as: 'guestList',
    });

    Event.hasMany(models.RSVP, {
      foreignKey: 'event_id',
      as: 'rsvps',
    });
  };

  return Event;
};
