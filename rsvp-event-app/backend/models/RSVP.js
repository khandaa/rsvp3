const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RSVP = sequelize.define(
    'RSVP',
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
      token: {
        type: DataTypes.STRING,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'attending', 'not_attending', 'maybe'),
        defaultValue: 'pending',
      },
      responseDate: {
        type: DataTypes.DATE,
        field: 'response_date',
      },
      numberOfGuests: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        field: 'number_of_guests',
        validate: {
          min: 1,
        },
      },
      dietaryRestrictions: {
        type: DataTypes.TEXT,
        field: 'dietary_restrictions',
      },
      specialRequirements: {
        type: DataTypes.TEXT,
        field: 'special_requirements',
      },
      message: {
        type: DataTypes.TEXT,
      },
      ipAddress: {
        type: DataTypes.STRING,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.TEXT,
        field: 'user_agent',
      },
    },
    {
      tableName: 'rsvps',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['event_id', 'guest_id'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['token'],
          unique: true,
        },
      ],
    }
  );

  // Define associations
  RSVP.associate = (models) => {
    RSVP.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });

    RSVP.belongsTo(models.Guest, {
      foreignKey: 'guest_id',
      as: 'guest',
    });

    RSVP.hasMany(models.RSVPPlusOne, {
      foreignKey: 'rsvp_id',
      as: 'plusOnes',
    });
  };

  return RSVP;
};
