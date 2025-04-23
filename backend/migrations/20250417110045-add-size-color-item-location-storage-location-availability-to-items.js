'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('items', 'size', {
      type: Sequelize.STRING(250), // Adjust as needed
      allowNull: true,
    });
    await queryInterface.addColumn('items', 'color', {
      type: Sequelize.STRING(250), // Adjust as needed
      allowNull: true,
    });
    await queryInterface.addColumn('items', 'item_location', {
      type: Sequelize.STRING(250), // Adjust as needed
      allowNull: true,
    });
    await queryInterface.addColumn('items', 'storage_location', {
      type: Sequelize.STRING(250), // Adjust as needed
      allowNull: true,
    });
    await queryInterface.addColumn('items', 'availability', {
      type: Sequelize.BOOLEAN, // Assuming availability is a boolean
      defaultValue: true,     // Set a default value if appropriate
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('items', 'size');
    await queryInterface.removeColumn('items', 'color');
    await queryInterface.removeColumn('items', 'item_location');
    await queryInterface.removeColumn('items', 'storage_location');
    await queryInterface.removeColumn('items', 'availability');
  }
};