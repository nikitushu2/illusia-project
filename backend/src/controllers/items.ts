import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Item } from "../models/index";
import { InferCreationAttributes } from "sequelize";
import * as itemService from "../services/itemService";

interface ItemRequest extends Request {
    item: Item | null;
  }

type ItemCreationAttributes = InferCreationAttributes<Item>;

interface ItemUpdateRequest {
    name?: string;
    description?: string;
    quantity?: number;
    categoryId?: number;
    location?: string;
  }

const router = Router();

const itemFinder = async (req: ItemRequest, _res: Response, next: NextFunction) => {
  req.item = await itemService.findById(req.params.id);
  next();
};

router.get("/", async (_req: Request, res: Response) => {
  const items = await itemService.findAll();
  console.log(JSON.stringify(items));
  res.json(items);
});

router.post("/", async (req: Request<{}, {}, ItemCreationAttributes>, res: Response, next: NextFunction) => {
  try {
    const item = await itemService.create(req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => itemFinder(req as ItemRequest, res, next), (req, res) => {
    if ((req as ItemRequest).item) {
        res.json((req as ItemRequest).item);
    } else {
        res.status(404).end();
    }
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => itemFinder(req as ItemRequest, res, next), async (req: Request<{id: string}, {}, ItemUpdateRequest>, res: Response, next: NextFunction): Promise<void> => {

    try {
        const typedReq = req as unknown as ItemRequest;
        const item = typedReq.item;
        
        if (!item) {
            res.status(404).end();
            return;
        }
        
        const typedItem = item as unknown as {
            name?: string;
            description?: string;
            quantity?: number;
            categoryId?: number;
            location?: string;
            save(): Promise<Item>;
        };
        
        if (req.body.name !== undefined) {
            typedItem.name = String(req.body.name);
        }
        
        if (req.body.description !== undefined) {
            typedItem.description = String(req.body.description);
        }
        
        if (req.body.quantity !== undefined) {
            typedItem.quantity = Number(req.body.quantity);
        }
        
        if (req.body.categoryId !== undefined) {
            typedItem.categoryId = Number(req.body.categoryId);
        }
        
        if (req.body.location !== undefined) {
            typedItem.location = String(req.body.location);
        }

        const updatedItem = await itemService.update(item, req.body);
        res.json(updatedItem);
    } catch (error) {
        next(error);
    }

});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => itemFinder(req as ItemRequest, res, next), async (req, res) => {
    const typedReq = req as unknown as ItemRequest;
    const item = typedReq.item;

    if (item) {
        await itemService.remove(item);
        res.status(204).end();
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

export { router };