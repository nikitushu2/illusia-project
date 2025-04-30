'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('booking_items', [
            {
                booking_id: 1,
                item_id: 42,
                quantity: 1
            },
            {
                booking_id: 2,
                item_id: 56,
                quantity: 3
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('booking_items', null, {});
    }
}; 