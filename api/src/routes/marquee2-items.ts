import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Get all marquee2 items (Public)
router.get(
  '/',
  // @ts-ignore
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.marquee2Item.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });

      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single marquee2 item
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const item = await prisma.marquee2Item.findUnique({
        where: { id },
      });

      if (!item) {
        throw new AppError('Marquee2 item not found', 404);
      }

      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create marquee2 item (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  [
    body('text').notEmpty().withMessage('Metin gereklidir'),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { text, order, isActive } = req.body;

      const item = await prisma.marquee2Item.create({
        data: {
          text,
          order: order || 0,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Marquee2 item başarıyla oluşturuldu',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update marquee2 item (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    body('text').optional().notEmpty(),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { text, order, isActive } = req.body;

      const item = await prisma.marquee2Item.findUnique({
        where: { id },
      });

      if (!item) {
        throw new AppError('Marquee2 item not found', 404);
      }

      const updateData: any = {};
      if (text !== undefined) updateData.text = text;
      if (order !== undefined) updateData.order = parseInt(order);
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.marquee2Item.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Marquee2 item güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete marquee2 item (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const item = await prisma.marquee2Item.findUnique({
        where: { id },
      });

      if (!item) {
        throw new AppError('Marquee2 item not found', 404);
      }

      await prisma.marquee2Item.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Marquee2 item silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

