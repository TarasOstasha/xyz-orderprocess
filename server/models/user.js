'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
      // Shared team board — no ownership associations yet
    }

    toSafeJSON() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Name cannot be empty' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: 'Must be a valid email' },
          notEmpty: { msg: 'Email cannot be empty' },
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
      },
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: {
          attributes: { exclude: [] },
        },
      },
    }
  );

  return User;
};
