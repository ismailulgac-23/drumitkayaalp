import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadFields } from '../middleware/upload';

const router = Router();

// Get all before-after items (Public for frontend)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.query;

      const where: any = {};
      
      // If not admin, only show active items
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        where.isActive = true;
      } else {
        if (isActive !== undefined) {
          where.isActive = isActive === 'true';
        }
      }

      const items = await prisma.beforeAfter.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
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

// Get single before-after item
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const item = await prisma.beforeAfter.findUnique({
        where: { id },
      });

      if (!item) {
        throw new AppError('BeforeAfter item not found', 404);
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

// Create before-after item (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadFields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
  ]),
  [
    body('title').notEmpty().withMessage('Başlık gereklidir'),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description, order, isActive } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files.beforeImage || files.beforeImage.length === 0) {
        throw new AppError('Öncesi görsel gereklidir', 400);
      }
      if (!files.afterImage || files.afterImage.length === 0) {
        throw new AppError('Sonrası görsel gereklidir', 400);
      }

      const beforeImageUrl = `/uploads/before-after/${files.beforeImage[0].filename}`;
      const afterImageUrl = `/uploads/before-after/${files.afterImage[0].filename}`;

      const item = await prisma.beforeAfter.create({
        data: {
          title,
          description: description || null,
          beforeImage: beforeImageUrl,
          afterImage: afterImageUrl,
          order: order || 0,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Öncesi-Sonrası başarıyla oluşturuldu',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update before-after item (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadFields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
  ]),
  [
    body('title').optional().notEmpty(),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, order, isActive } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const item = await prisma.beforeAfter.findUnique({
        where: { id },
      });

      if (!item) {
        throw new AppError('BeforeAfter item not found', 404);
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (files.beforeImage && files.beforeImage.length > 0) {
        updateData.beforeImage = `/uploads/before-after/${files.beforeImage[0].filename}`;
      }
      if (files.afterImage && files.afterImage.length > 0) {
        updateData.afterImage = `/uploads/before-after/${files.afterImage[0].filename}`;
      }
      if (order !== undefined) updateData.order = parseInt(order);
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.beforeAfter.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Öncesi-Sonrası güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete before-after item (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const item = await prisma.beforeAfter.findUnique({
        where: { id },
      });

      if (!item) {
        throw new AppError('BeforeAfter item not found', 404);
      }

      await prisma.beforeAfter.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Öncesi-Sonrası silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

