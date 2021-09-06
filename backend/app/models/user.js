const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });
    }
  };

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    biometric: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    refreshTokenCreatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};