const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventVenue = sequelize.define(
    'EventVenue',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      addressLine1: {
        type: DataTypes.STRING,
        field: 'address_line1',
      },
      addressLine2: {
        type: DataTypes.STRING,
        field: 'address_line2',
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      postalCode: {
        type: DataTypes.STRING,
        field: 'postal_code',
      },
      latitude: {
        type: DataTypes.FLOAT,
      },
      longitude: {
        type: DataTypes.FLOAT,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_primary',
      },
      capacity: {
        type: DataTypes.INTEGER,
      },
      contactName: {
        type: DataTypes.STRING,
        field: 'contact_name',
      },
      contactPhone: {
        type: DataTypes.STRING,
        field: 'contact_phone',
      },
      contactEmail: {
        type: DataTypes.STRING,
        field: 'contact_email',
        validate: {
          isEmail: true,
        },
      },
      notes: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING,
        field: 'image_url',
      },
    },
    {
      tableName: 'event_venues',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['event_id'],
        },
        {
          fields: ['is_primary'],
        },
      ],
    }
  );

  // Define associations
  EventVenue.associate = (models) => {
    EventVenue.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });
  };

  return EventVenue;
};
