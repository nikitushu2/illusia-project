'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', [
            {
                email: 'test1@gmail.com',
                display_name: 'test1',
                role: 'USER',
                is_approved: false
            },
            {
                email: 'test2@gmail.com',
                display_name: 'test2',
                role: 'USER',
                is_approved: true
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
}; 