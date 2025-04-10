'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('items', [
            {
                name: 'Kypäriä',
                description: 'Sotilaskypärä musta, large',
                image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
                price: 99.99,
                category_id: 15, // Helmets category
                created_at: new Date()
            },
            {
                name: 'Taisteluliivejä (IKEA-kassi)',
                description: 'Taisteluliivi musta (uusi malli), EL-nauhoilla.',
                image_url: 'https://images.unsplash.com/photo-1538688423619-a81d3f23454b',
                price: 149.99,
                category_id: 16, // Combat Vests category
                created_at: new Date()
            },
            {
                name: 'Medical Supplies',
                description: 'Medbay supplies / wooden crate,Bedding, curtains, meds, instruments, manuals papers',
                image_url: 'https://images.unsplash.com/photo-1503602642458-232111445657',
                price: 199.99,
                category_id: 17, // Medical Supplies category
                created_at: new Date()
            },
            {
                name: 'Suojalaseja/-maskeja + varusteita',
                description: 'Suojalasit/-maski  EL-nauhaa (2x3m, 3x2m), Molle-kiinnitteinen kännykkäpidike',
                image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575',
                price: 59.99,
                category_id: 18, // Goggles/Masks category
                created_at: new Date()
            },

        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('items', null, {});
    }
}; 