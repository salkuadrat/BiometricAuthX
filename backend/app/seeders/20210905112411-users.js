const bcrypt = require('bcryptjs');
const { secret } = require('../config/auth');

module.exports = {
  up: async (queryInterface, _) => {
    const username = 'admin';
    const biometricSecret = `${secret}.${username}.${Date.now()}`;
    const biometricToken = bcrypt.hashSync(biometricSecret);

    return await queryInterface.bulkInsert('Users', [{ 
      username: username, 
      email: 'admin@bioauth.com', 
      password: bcrypt.hashSync('1234'),
      biometric: bcrypt.hashSync(biometricToken),
      createdAt: new Date(), 
      updatedAt: new Date()
    }]);
  },
  down: async (queryInterface, _) => {
    return await queryInterface.bulkDelete('Users', null, {});
  }
};