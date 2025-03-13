'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Step.belongsTo(models.Task, {
        foreignKey: 'taskId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Step.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    step: DataTypes.STRING,
    date: DataTypes.STRING,
    by: DataTypes.STRING,
    notes: DataTypes.STRING,
    taskId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Step',
    underscored: true
  });
  return Step;
};