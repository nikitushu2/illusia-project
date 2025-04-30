'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('booking_items', [
            {
                booking_id: 8,
                item_id: 5,
                quantity: 1
            },
            {
              booking_id: 9,
              item_id: 6,
              quantity: 3
          }
            
            
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('booking_items', null, {});
    }
}; 