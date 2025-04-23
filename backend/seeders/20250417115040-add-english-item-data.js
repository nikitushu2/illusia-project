'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [{
      name: 'Halloween Mask',
      description: 'Superhero mask for Halloween.',
      size: null,
      color: 'Green',
      item_location: 'Helsinki',
      storage_location: 'Room 1',
      availability: true,
      price: 99.99,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Batman Costume',
      description: 'Tactical vest for combat situations.',
      size: null,
      color: 'Black',
      item_location: 'Helsinki',
      storage_location: 'Room 2',
      availability: true,
      price: 149.99,
      created_at: new Date(),
      updated_at: new Date(),
    }];

    try {
      await queryInterface.bulkInsert('items', items, {});
      console.log(`Added ${items.length} items to database`);
    } catch (error) {
      console.error('Error inserting items:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
