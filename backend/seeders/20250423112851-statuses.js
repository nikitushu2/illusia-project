'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('statuses', [
            {
                name: 'Reserved'
            },
            {
                name: 'Cancelled/rejected'
            },
            {
                name: 'Pending approval'
            },
            {
                name: 'In progress'
            },
            {
                name: 'Closed/completed'
            },
            {
                name: 'In queue'
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('statuses', null, {});
    }
}; 