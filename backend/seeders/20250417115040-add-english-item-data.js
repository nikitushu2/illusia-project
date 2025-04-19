'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const csvFilePath = path.join(__dirname, '../data/Test-Data-Eng.csv'); // Updated file name

    try {
      const csvFile = fs.readFileSync(csvFilePath, { encoding: 'utf8' });
      const records = parse(csvFile, {
        delimiter: ';',
        columns: true,
        skip_empty_lines: true,
      });

      const itemsData = records.map(record => ({
        name: record.name,
        description: record.description,
        size: record.size === '' ? null : record.size,
        color: record.color === '' ? null : record.color,
        item_location: record.itemLocation,
        storage_location: record.storageLocation,
        availability: record.availability === 'true', // Convert string to boolean
        price: 0, // <-- Add this line to set default price
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await queryInterface.bulkInsert('items', itemsData, {});
    } catch (error) {
      console.error('Error reading or processing CSV file:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
