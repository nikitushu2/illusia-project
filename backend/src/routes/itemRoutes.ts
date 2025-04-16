import { Router } from 'express';
import * as itemController from '../controllers/itemController';

const router = Router();

// Get all items with optional category filtering
router.get('/', itemController.findAll);

// Search items with optional category filtering
router.get('/search', itemController.search);

// Get item by ID
router.get('/:id', itemController.findById);

// Create new item
router.post('/', itemController.create);

// Update item
router.put('/:id', itemController.update);

// Delete item
router.delete('/:id', itemController.remove);

export default router; 