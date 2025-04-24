'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('bookings', [
            {
                user_id: 3,
                start_date: '2025-01-01',
                end_date: '2025-01-30',
                status_id: 1
            },
            {
              user_id: 4,
              start_date: '2025-03-01',
              end_date: '2025-03-30',
              status_id: 3
          }
            
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('bookings', null, {});
    }
}; 