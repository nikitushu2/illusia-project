'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add updated_at column to items table
    await queryInterface.addColumn('items', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add updated_at column to categories table
    await queryInterface.addColumn('categories', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Update the existing rows to have the same value for updated_at as created_at
    await queryInterface.sequelize.query(`
      UPDATE items SET updated_at = created_at WHERE updated_at IS NULL;
      UPDATE categories SET updated_at = created_at WHERE updated_at IS NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove updated_at column from items table
    await queryInterface.removeColumn('items', 'updated_at');

    // Remove updated_at column from categories table
    await queryInterface.removeColumn('categories', 'updated_at');
  }
};
