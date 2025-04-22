'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Hardcoded sample data replacing CSV import
      const items = [
        {
          name: 'Combat Helmet',
          description: 'Standard issue combat helmet. Provides head protection.',
          image_url: 'https://via.placeholder.com/150',
          price: 99.99,
          category_id: 1, // Helmets
          quantity: 15,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Tactical Vest',
          description: 'Tactical combat vest with multiple storage compartments.',
          image_url: 'https://via.placeholder.com/150',
          price: 149.99,
          category_id: 2, // Combat Vests
          quantity: 10,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'First Aid Kit',
          description: 'Complete medical first aid kit for emergency situations.',
          image_url: 'https://via.placeholder.com/150',
          price: 49.99,
          category_id: 3, // Medical Supplies
          quantity: 20,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Tactical Goggles',
          description: 'Protective eye gear for combat situations.',
          image_url: 'https://via.placeholder.com/150',
          price: 29.99,
          category_id: 4, // Goggles/Masks
          quantity: 25,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Ballistic Helmet',
          description: 'Advanced ballistic helmet with enhanced protection.',
          image_url: 'https://via.placeholder.com/150',
          price: 199.99,
          category_id: 1, // Helmets
          quantity: 8,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      // Insert the data into the items table
      await queryInterface.bulkInsert('items', items, {});

      console.log(`Added ${items.length} hardcoded items to database`);
    } catch (error) {
      console.error('Error inserting seed data:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    // You might want to be more specific about which items to delete
    // For example, you could store the IDs of added items somewhere
    // For now, this will delete all items - be careful with this in production!
    await queryInterface.bulkDelete('items', null, {});
  }
};
