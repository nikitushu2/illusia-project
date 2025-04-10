import { sequelize } from '../util/db';
import Item from './item';
import User from './user';
import Category from './category';

// Initialize models
const models = {
  Item,
  User,
  Category
};

// Define model associations here if needed
// Example: models.Category.hasMany(models.Item);
// Example: models.Item.belongsTo(models.Category);

// Set up one-to-many relationship between Category and Item
Category.hasMany(Item, {
  foreignKey: 'categoryId',
  as: 'items'
});

Item.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Sync all models with database
const syncModels = async (): Promise<void> => {
  await Category.sync();
  await Item.sync();
  await User.sync();
  console.log('Models synchronized with database');
};

export { 
  Item, 
  User,
  Category,
  syncModels,
  sequelize
};

export default models;

