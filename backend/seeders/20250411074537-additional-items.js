'use strict';
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Update this path to wherever your CSV file is located
      const csvFilePath = path.resolve(__dirname, '../data/Test-Data.csv');

      // Read the CSV file
      const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

      // Parse the CSV content
      const records = parse(fileContent, {
        columns: true, // Use first row as header
        skip_empty_lines: true,
        delimiter: ';' // Your CSV uses semicolons as separators
      });

      // Check what category to use for each item based on description
      const getCategoryId = (description) => {
        if (description.toLowerCase().includes('kypär')) return 1; // Helmets
        if (description.toLowerCase().includes('liivi')) return 2; // Combat Vests  
        if (description.toLowerCase().includes('medical') ||
          description.toLowerCase().includes('first aid')) return 3; // Medical Supplies
        if (description.toLowerCase().includes('lasej') ||
          description.toLowerCase().includes('maski')) return 4; // Goggles/Masks
        return 1; // Default to Helmets if no match
      };

      // Extract quantity from content summary
      const extractQuantity = (contentSummary) => {
        if (!contentSummary) return 1;

        // Look for patterns like "x 6" or "x6"
        const quantityMatch = contentSummary.match(/x\s*(\d+)/i);
        if (quantityMatch && quantityMatch[1]) {
          return parseInt(quantityMatch[1], 10);
        }

        return 1; // Default to 1 if no quantity found
      };

      // Transform CSV data to match your items table structure
      const items = records.map(record => {
        // Get the description and content summary fields
        const name = record['Description'] || '';
        const contentSummary = record['Content summary'] || '';
        const storageDetails = record['Storage details'] || '';

        // Extract quantity from content summary
        const quantity = extractQuantity(contentSummary);

        return {
          name: name,
          description: `${contentSummary}. ${storageDetails}`.trim(),
          image_url: 'https://via.placeholder.com/150', // Default image
          price: 0, // Default price
          category_id: getCategoryId(name), // Determine category from the name
          quantity: quantity, // Add the quantity field
          created_at: new Date()
        };
      });

      // Insert the data into the items table
      await queryInterface.bulkInsert('items', items, {});

      console.log(`Added ${items.length} items from CSV file`);
    } catch (error) {
      console.error('Error importing CSV data:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    // You might want to be more specific about which items to delete
    // For example, you could store the IDs of added items somewhere
    // For now, this will delete all items - be careful with this in production!
    await queryInterface.bulkDelete('items', null, {});
  }
};
