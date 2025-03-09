'use strict';
const {
  Model
} = require('sequelize');
const { PRIORITY } = require('../constants');


module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.hasMany(models.Step, {
        foreignKey: 'taskId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Task.hasOne(models.Note, {
        foreignKey: 'taskId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,          // Makes the column NOT NULL
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        }
      }
    },
    ship: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Ship field cannot be empty'
        }
      }
    },
    art: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'art must be a valid date'
        },
        notInPast(value) {
          if (new Date(value) < new Date()) {
            throw new Error('art cannot be in the past');
          }
        }
      }
    },
    inHand: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'inHand must be a valid date'
        },
        notInPast(value) {
          if (new Date(value) < new Date()) {
            throw new Error('art cannot be in the past');
          }
        }
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'dueDate must be a valid date'
        },
        notInPast(value) {
          if (new Date(value) < new Date()) {
            throw new Error('art cannot be in the past');
          }
        }
      }
    },
    status: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    priority: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [PRIORITY],
          msg: 'Priority must be High, Medium, or Low'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
    underscored: true
  });
  return Task;
};