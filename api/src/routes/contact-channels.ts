import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Get all contact channels (Public - for frontend)
router.get(
  '/',
  // @ts-ignore
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const channels = await prisma.contactChannel.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });

      res.json({
        success: true,
        data: channels,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all contact channels (Admin - with inactive ones)
router.get(
  '/admin',
  authenticate,
  authorizeAdmin,
  // @ts-ignore
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const channels = await prisma.contactChannel.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });

      res.json({
        success: true,
        data: channels,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get contact channel by ID (Admin only)
router.get(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const channel = await prisma.contactChannel.findUnique({
        where: { id },
      });

      if (!channel) {
        throw new AppError('İletişim kanalı bulunamadı', 404);
      }

      res.json({
        success: true,
        data: channel,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create contact channel (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  [
    body('type').notEmpty().withMessage('Tip gereklidir'),
    body('label').notEmpty().withMessage('Etiket gereklidir'),
    body('value').notEmpty().withMessage('Değer gereklidir'),
    body('icon').optional().isString(),
    body('order').optional().isInt(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { type, label, value, icon, order } = req.body;

      const channel = await prisma.contactChannel.create({
        data: {
          type,
          label,
          value,
          icon,
          order: order || 0,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'İletişim kanalı başarıyla oluşturuldu',
        data: channel,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update contact channel (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    body('type').optional().notEmpty(),
    body('label').optional().notEmpty(),
    body('value').optional().notEmpty(),
    body('icon').optional().isString(),
    body('order').optional().isInt(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { type, label, value, icon, order } = req.body;

      const channel = await prisma.contactChannel.findUnique({
        where: { id },
      });

      if (!channel) {
        throw new AppError('İletişim kanalı bulunamadı', 404);
      }

      const updated = await prisma.contactChannel.update({
        where: { id },
        data: {
          ...(type && { type }),
          ...(label && { label }),
          ...(value && { value }),
          ...(icon !== undefined && { icon }),
          ...(order !== undefined && { order }),
        },
      });

      res.json({
        success: true,
        message: 'İletişim kanalı başarıyla güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete contact channel (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const channel = await prisma.contactChannel.findUnique({
        where: { id },
      });

      if (!channel) {
        throw new AppError('İletişim kanalı bulunamadı', 404);
      }

      await prisma.contactChannel.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'İletişim kanalı başarıyla silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Toggle contact channel active status (Admin only)
router.patch(
  '/:id/toggle',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const channel = await prisma.contactChannel.findUnique({
        where: { id },
      });

      if (!channel) {
        throw new AppError('İletişim kanalı bulunamadı', 404);
      }

      const updated = await prisma.contactChannel.update({
        where: { id },
        data: {
          isActive: !channel.isActive,
        },
      });

      res.json({
        success: true,
        message: `İletişim kanalı ${updated.isActive ? 'aktif' : 'pasif'} edildi`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

