const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isIn: [['admin', 'event_manager', 'event_host', 'guest', 'hospitality', 'vendor']],
        },
      },
      description: {
        type: DataTypes.STRING,
      },
      permissions: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'roles',
      timestamps: true,
      underscored: true,
    }
  );

  // Define associations
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: 'user_roles',
      foreignKey: 'role_id',
      otherKey: 'user_id',
    });
  };

  return Role;
};
