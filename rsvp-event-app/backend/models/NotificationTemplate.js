const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NotificationTemplate = sequelize.define(
    'NotificationTemplate',
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
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('email', 'sms', 'whatsapp', 'push'),
        allowNull: false,
      },
      variables: {
        type: DataTypes.JSON,
        comment: 'JSON array of variable names that can be used in the template',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
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
      tableName: 'notification_templates',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['name'],
          unique: true,
        },
        {
          fields: ['type'],
        },
        {
          fields: ['is_active'],
        },
      ],
    }
  );

  // Define associations
  NotificationTemplate.associate = (models) => {
    NotificationTemplate.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });

    NotificationTemplate.hasMany(models.Notification, {
      foreignKey: 'template_id',
      as: 'notifications',
    });
  };

  return NotificationTemplate;
};
