import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Item } from "../models";
import * as itemService from "../services/itemService";

interface ItemRequest extends Request {
    item: Item | null;
  }

type ItemCreationAttributes = {
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  categoryId: number;
};

interface ItemUpdateRequest {
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    quantity?: number;
  }

const privateItemsRouter = Router();
const publicItemsRouter = Router();
const adminItemsRouter = Router();

const itemFinder = async (req: ItemRequest, _res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  req.item = await itemService.findById(id);
  next();
};

publicItemsRouter.get("/", async (_req: Request, res: Response) => {
  const items = await itemService.findAll();
  res.json(items);
});

// Get items by category
publicItemsRouter.get("/category/:categoryId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.categoryId, 10);
    const items = await itemService.findByCategory(categoryId);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Search items by name or description
publicItemsRouter.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }
    
    const items = await itemService.search(query);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

privateItemsRouter.post("/", async (req: Request<{}, {}, ItemCreationAttributes>, res: Response, next: NextFunction) => {
  try {
    console.log('Creating item with data:', req.body);
    const item = await itemService.create(req.body);
    console.log('Item created successfully:', item);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    next(error);
  }
});

privateItemsRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => itemFinder(req as ItemRequest, res, next), (req, res) => {
    if ((req as ItemRequest).item) {
        res.json((req as ItemRequest).item);
    } else {
        res.status(404).end();
    }
});

adminItemsRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => itemFinder(req as ItemRequest, res, next), async (req: Request<{id: string}, {}, ItemUpdateRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const typedReq = req as unknown as ItemRequest;
        const item = typedReq.item;
        
        if (!item) {
            res.status(404).end();
            return;
        }
        
        const id = parseInt(req.params.id, 10);
        const updatedItem = await itemService.update(id, req.body);
        res.json(updatedItem);
    } catch (error) {
        next(error);
    }
});

// New endpoint to update just the quantity
adminItemsRouter.patch('/:id/quantity', (req: Request, res: Response, next: NextFunction) => itemFinder(req as ItemRequest, res, next), async (req: Request<{id: string}, {}, {quantity: number}>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const typedReq = req as unknown as ItemRequest;
        const item = typedReq.item;
        
        if (!item) {
            res.status(404).end();
            return;
        }
        
        const id = parseInt(req.params.id, 10);
        const updatedItem = await itemService.update(id, { quantity: req.body.quantity });
        res.json(updatedItem);
    } catch (error) {
        next(error);
    }
});

adminItemsRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => itemFinder(req as ItemRequest, res, next), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const typedReq = req as unknown as ItemRequest;
        const item = typedReq.item;
        
        if (!item) {
            res.status(404).end();
            return;
        }
        
        const id = parseInt(req.params.id, 10);
        await itemService.remove(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export { privateItemsRouter, publicItemsRouter, adminItemsRouter };