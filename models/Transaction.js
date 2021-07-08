'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Houses, {
        as: 'house',
        foreignKey: 'house_id',
      });
    }
  };
  Transaction.init({
    checkin: DataTypes.DATEONLY,
    checkout: DataTypes.DATEONLY,
    total: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    house_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
  });
  return Transaction;
};