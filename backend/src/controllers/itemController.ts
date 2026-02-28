import { Request, Response } from 'express';
import * as itemService from '../services/itemService';
import { ItemCreationAttributes, ItemUpdateAttributes } from '../services/itemService';

export const findAll = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { categoryIds } = req.query;
    const filterOptions: itemService.ItemFilterOptions = {
      categoryIds: categoryIds 
        ? (Array.isArray(categoryIds) ? categoryIds.map(Number) : [Number(categoryIds)])
        : undefined
    };
    
    const items = await itemService.findAll(filterOptions);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching items', error });
  }
};

export const search = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { query, categoryIds } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const parsedCategoryIds = categoryIds 
      ? (Array.isArray(categoryIds) ? categoryIds.map(Number) : [Number(categoryIds)])
      : undefined;

    const items = await itemService.searchItems(query, parsedCategoryIds);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Error searching items', error });
  }
};

export const findById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const idString = Array.isArray(id) ? id[0] : id;
    const idNumber = parseInt(idString, 10);
    
    if (isNaN(idNumber)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const item = await itemService.findById(idNumber);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching item', error });
  }
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const itemData = req.body as ItemCreationAttributes;
    const newItem = await itemService.create(itemData);
    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating item', error });
  }
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const idString = Array.isArray(id) ? id[0] : id;
    const idNumber = parseInt(idString, 10);
    
    if (isNaN(idNumber)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const updates = req.body as ItemUpdateAttributes;
    const updatedItem = await itemService.update(idNumber, updates);
    return res.json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating item', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const idString = Array.isArray(id) ? id[0] : id;
    const idNumber = parseInt(idString, 10);
    
    if (isNaN(idNumber)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    await itemService.remove(idNumber);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting item', error });
  }
}; 