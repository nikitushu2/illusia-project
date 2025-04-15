import Item from "../models/item";
import Category from "../models/category";
import { ItemAttributes } from "../models/item";
import { Op } from "sequelize";

export interface ItemFilterOptions {
  categoryIds?: number[];
}

export type ItemCreationAttributes = Omit<ItemAttributes, 'id' | 'createdAt'>;
export type ItemUpdateAttributes = Partial<ItemCreationAttributes>;

export const findAll = async (options?: ItemFilterOptions): Promise<Item[]> => {
  const where = {};
  
  if (options?.categoryIds && options.categoryIds.length > 0) {
    Object.assign(where, { categoryId: options.categoryIds });
  }
  
  return await Item.findAll({
    where,
    include: [{
      model: Category,
      as: 'category'
    }],
  });
};

export const findById = async (id: number): Promise<Item | null> => {
  return await Item.findByPk(id, {
    include: [{
      model: Category,
      as: 'category'
    }],
  });
};

export const create = async (itemData: ItemCreationAttributes): Promise<Item> => {
  try {
    const item = await Item.create(itemData);
    const createdItem = await Item.findByPk(item.id, {
      include: [{
        model: Category,
        as: 'category'
      }],
    });
    if (!createdItem) {
      throw new Error("Failed to create item");
    }
    return createdItem;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const update = async (id: number, itemData: ItemUpdateAttributes): Promise<Item> => {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new Error("Item not found");
  }
  await item.update(itemData);
  const updatedItem = await Item.findByPk(id, {
    include: [{
      model: Category,
      as: 'category'
    }],
  });
  if (!updatedItem) {
    throw new Error("Failed to update item");
  }
  return updatedItem;
};

export const remove = async (id: number): Promise<boolean> => {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new Error("Item not found");
  }
  await item.destroy();
  return true;
};

export const findByCategory = async (categoryId: number): Promise<Item[]> => {
  return await Item.findAll({
    where: { categoryId },
    include: [{
      model: Category,
      as: 'category'
    }],
  });
};

export const search = async (query: string): Promise<Item[]> => {
  return await Item.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
    include: [{
      model: Category,
      as: 'category'
    }],
  });
};

// Alias for search function with categoryIds support
export const searchItems = async (query: string, categoryIds?: number[]): Promise<Item[]> => {
  const whereClause: {
    [Op.or]: Array<{[key: string]: {[key: string]: string}}>;
    categoryId?: number[];
  } = {
    [Op.or]: [
      { name: { [Op.iLike]: `%${query}%` } },
      { description: { [Op.iLike]: `%${query}%` } },
    ]
  };
  
  if (categoryIds && categoryIds.length > 0) {
    whereClause.categoryId = categoryIds;
  }
  
  return await Item.findAll({
    where: whereClause,
    include: [{
      model: Category,
      as: 'category'
    }],
  });
};