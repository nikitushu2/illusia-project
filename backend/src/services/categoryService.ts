import { Category, Item } from "../models/index";
import { InferCreationAttributes } from "sequelize";

export type CategoryCreationAttributes = InferCreationAttributes<Category>;

export interface CategoryUpdateAttributes {
  name?: string;
  description?: string;
}

export const findAll = async (): Promise<Category[]> => {
  return await Category.findAll();
};

export const findById = async (id: string): Promise<Category | null> => {
  return await Category.findByPk(id);
};

export const findWithItems = async (id: string): Promise<Category | null> => {
  return await Category.findByPk(id, {
    include: [{
      model: Item,
      as: 'items'
    }]
  });
};

export const create = async (categoryData: CategoryCreationAttributes): Promise<Category> => {
  return await Category.create(categoryData);
};

export const update = async (category: Category, updates: CategoryUpdateAttributes): Promise<Category> => {
  if (updates.name !== undefined) {
    category.set('name', String(updates.name));
  }
  
  if (updates.description !== undefined) {
    category.set('description', String(updates.description));
  }

  await category.save();
  return category;
};

export const remove = async (category: Category): Promise<void> => {
  await category.destroy();
}; 