'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PastedHistory extends Model {
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
  PastedHistory.init({
    text: DataTypes.STRING,
    images: DataTypes.STRING,
    taskId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pastedHistory',
    underscored: true
  });
  return PastedHistory;
};