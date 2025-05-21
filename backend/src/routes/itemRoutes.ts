import { Router } from "express";
import * as itemController from "../controllers/itemController";

const router = Router();

// Get all items with optional category filtering
router.get("/", itemController.findAll as any);

// Search items with optional category filtering
router.get("/search", itemController.search as any);

// Get item by ID
router.get("/:id", itemController.findById as any);

// Create new item
router.post("/", itemController.create as any);

// Update item
router.put("/:id", itemController.update as any);

// Delete item
router.delete("/:id", itemController.remove as any);

export default router;
