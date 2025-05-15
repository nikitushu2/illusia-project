'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('bookings', [
            {
                user_id: 25,
                start_date: '2025-01-01',
                end_date: '2025-01-30',
                status: 'RESERVED'
            },
            {
              user_id: 87,
              start_date: '2025-03-01',
              end_date: '2025-03-30',
              status: 'PENDING_APPROVAL'
          }
            
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('bookings', null, {});
    }
}; 