import { Item } from "../models/index";
import { InferCreationAttributes } from "sequelize";

export type ItemCreationAttributes = InferCreationAttributes<Item>;

export interface ItemUpdateAttributes {
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
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
  
  if (updates.imageUrl !== undefined) {
    item.set('imageUrl', String(updates.imageUrl));
  }
  
  if (updates.price !== undefined) {
    item.set('price', Number(updates.price));
  }

  await item.save();
  return item;
};

export const remove = async (item: Item): Promise<void> => {
  await item.destroy();
};