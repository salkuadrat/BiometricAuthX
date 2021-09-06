module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Posts', [
      {
        userId: 1,
        title: 'Universe',
        content: 'The easy and flexible way to use interactive maps in Flutter',
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: 'Learning',
        content: 'The easy way to use Machine Learning Kit in Flutter',
        createdAt: new Date(), 
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Posts', null, {});
  }
};