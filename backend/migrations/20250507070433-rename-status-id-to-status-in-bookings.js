'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('bookings', 'status_id', 'status');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('bookings', 'status', 'status_id');
  }
};