'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Note.belongsTo(models.Task, {
        foreignKey: 'taskId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Note.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    critical: DataTypes.TEXT,
    general: DataTypes.TEXT,
    art: DataTypes.TEXT,
    taskId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Note',
    underscored: true
  });
  return Note;
};