import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Get contact map (Public)
router.get(
  '/',
  // @ts-ignore
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const map = await prisma.contactMap.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      });

      res.json({
        success: true,
        data: map,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all contact maps (Admin)
router.get(
  '/all',
  authenticate,
  authorizeAdmin,
  // @ts-ignore
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const maps = await prisma.contactMap.findMany({
        orderBy: { updatedAt: 'desc' },
      });

      res.json({
        success: true,
        data: maps,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create contact map (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  [
    body('iframeCode').notEmpty().withMessage('Iframe kodu gereklidir'),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { iframeCode, isActive } = req.body;

      const map = await prisma.contactMap.create({
        data: {
          iframeCode,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'İletişim haritası başarıyla oluşturuldu',
        data: map,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update contact map (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    body('iframeCode').optional().notEmpty(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { iframeCode, isActive } = req.body;

      const map = await prisma.contactMap.findUnique({
        where: { id },
      });

      if (!map) {
        throw new AppError('Contact map not found', 404);
      }

      const updateData: any = {};
      if (iframeCode !== undefined) updateData.iframeCode = iframeCode;
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.contactMap.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'İletişim haritası güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete contact map (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const map = await prisma.contactMap.findUnique({
        where: { id },
      });

      if (!map) {
        throw new AppError('Contact map not found', 404);
      }

      await prisma.contactMap.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'İletişim haritası silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

