'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categories', [
            {
                name: 'Helmets',
                description: 'Military helmets and accessories',
                created_at: new Date()
            },
            {
                name: 'Combat Vests',
                description: 'Tactical vests and gear',
                created_at: new Date()
            },
            {
                name: 'Medical Supplies',
                description: 'First aid kits and medical equipment',
                created_at: new Date()
            },
            {
                name: 'Goggles/Masks',
                description: 'Protective eyewear and masks',
                created_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('categories', null, {});
    }
}; 