const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RSVPPlusOne = sequelize.define(
    'RSVPPlusOne',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rsvpId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rsvp_id',
        references: {
          model: 'rsvps',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      dietaryRestrictions: {
        type: DataTypes.TEXT,
        field: 'dietary_restrictions',
      },
      specialRequirements: {
        type: DataTypes.TEXT,
        field: 'special_requirements',
      },
      isAttending: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_attending',
      },
    },
    {
      tableName: 'rsvp_plus_ones',
      timestamps: true,
      underscored: true,
    }
  );

  // Define associations
  RSVPPlusOne.associate = (models) => {
    RSVPPlusOne.belongsTo(models.RSVP, {
      foreignKey: 'rsvp_id',
      as: 'rsvp',
    });
  };

  return RSVPPlusOne;
};
