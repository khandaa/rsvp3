const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GuestGroup = sequelize.define(
    'GuestGroup',
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
      description: {
        type: DataTypes.TEXT,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'guest_groups',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['event_id'],
        },
        {
          fields: ['name'],
        },
      ],
    }
  );

  // Define associations
  GuestGroup.associate = (models) => {
    GuestGroup.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });

    GuestGroup.belongsToMany(models.Guest, {
      through: 'guest_group_members',
      foreignKey: 'group_id',
      otherKey: 'guest_id',
      as: 'members',
    });
  };

  return GuestGroup;
};
