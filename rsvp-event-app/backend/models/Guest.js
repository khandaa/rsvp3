const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Guest = sequelize.define(
    'Guest',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
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
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        field: 'date_of_birth',
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      },
      isVip: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_vip',
      },
      notes: {
        type: DataTypes.TEXT,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      customFields: {
        type: DataTypes.JSONB,
        field: 'custom_fields',
        defaultValue: {},
      },
    },
    {
      tableName: 'guests',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['email'],
        },
        {
          fields: ['phone'],
        },
        {
          fields: ['is_vip'],
        },
      ],
    }
  );

  // Define associations
  Guest.associate = (models) => {
    Guest.belongsToMany(models.Event, {
      through: models.EventGuest,
      foreignKey: 'guest_id',
      as: 'events',
    });

    Guest.hasMany(models.RSVP, {
      foreignKey: 'guest_id',
      as: 'rsvps',
    });

    Guest.belongsToMany(models.GuestGroup, {
      through: 'guest_group_members',
      foreignKey: 'guest_id',
      otherKey: 'group_id',
      as: 'groups',
    });
  };

  return Guest;
};
