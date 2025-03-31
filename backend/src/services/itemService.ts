import { Item } from "../models/index";
import { InferCreationAttributes } from "sequelize";

export type ItemCreationAttributes = InferCreationAttributes<Item>;

export interface ItemUpdateAttributes {
  name?: string;
  description?: string;
  quantity?: number;
  categoryId?: number;
  location?: string;
}

export const findAll = async (): Promise<Item[]> => {
  return await Item.findAll();
};

export const findById = async (id: string): Promise<Item | null> => {
  return await Item.findByPk(id);
};

export const create = async (itemData: ItemCreationAttributes): Promise<Item> => {
  return await Item.create(itemData);
};

export const update = async (item: Item, updates: ItemUpdateAttributes): Promise<Item> => {
  if (updates.name !== undefined) {
    item.set('name', String(updates.name));
  }
  
  if (updates.description !== undefined) {
    item.set('description', String(updates.description));
  }
  
  if (updates.quantity !== undefined) {
    item.set('quantity', Number(updates.quantity));
  }
  
  if (updates.categoryId !== undefined) {
    item.set('categoryId', Number(updates.categoryId));
  }
  
  if (updates.location !== undefined) {
    item.set('location', String(updates.location));
  }

  await item.save();
  return item;
};

export const remove = async (item: Item): Promise<void> => {
  await item.destroy();
};