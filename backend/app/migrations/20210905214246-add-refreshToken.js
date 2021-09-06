module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'refreshToken', Sequelize.STRING);
    queryInterface.addColumn('Users', 'refreshTokenCreatedAt', Sequelize.DATE);
    return;
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'refreshToken');
    queryInterface.removeColumn('Users', 'refreshTokenCreatedAt');
    return;
  }
};