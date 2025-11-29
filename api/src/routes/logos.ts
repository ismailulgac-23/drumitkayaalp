import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get all logos (Public - for frontend)
router.get(
  '/',
  // @ts-ignore
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const logos = await prisma.logo.findMany({
        where: { isActive: true },
      });

      res.json({
        success: true,
        data: logos,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get logo by type (Public)
router.get(
  '/type/:type',
  // @ts-ignore
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;

      const logo = await prisma.logo.findUnique({
        where: { type },
      });

      if (!logo || !logo.isActive) {
        return res.json({
          success: true,
          data: null,
        });
      }

      res.json({
        success: true,
        data: logo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all logos (Admin - with inactive ones)
router.get(
  '/admin',
  authenticate,
  authorizeAdmin,
  // @ts-ignore
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const logos = await prisma.logo.findMany({
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: logos,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get logo by ID (Admin only)
router.get(
  '/:id',
  authenticate,
  authorizeAdmin,
  // @ts-ignore
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const logo = await prisma.logo.findUnique({
        where: { id },
      });

      if (!logo) {
        throw new AppError('Logo bulunamadı', 404);
      }

      res.json({
        success: true,
        data: logo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create logo (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('logos'),
  [
    body('type').notEmpty().withMessage('Tip gereklidir'),
    body('name').notEmpty().withMessage('İsim gereklidir'),
    body('alt').optional().isString(),
    body('width').optional().isInt(),
    body('height').optional().isInt(),
  ],
  validateRequest,
  // @ts-ignore
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { type, name, alt, width, height } = req.body;

      if (!req.file) {
        throw new AppError('Logo dosyası yüklenmedi', 400);
      }

      const fileUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;

      // Check if logo with this type already exists
      const existing = await prisma.logo.findUnique({
        where: { type },
      });

      let logo;
      if (existing) {
        // Update existing logo
        logo = await prisma.logo.update({
          where: { type },
          data: {
            name,
            url: fileUrl,
            alt: alt || name,
            width: width ? parseInt(width) : null,
            height: height ? parseInt(height) : null,
            isActive: true,
          },
        });
      } else {
        // Create new logo
        logo = await prisma.logo.create({
          data: {
            type,
            name,
            url: fileUrl,
            alt: alt || name,
            width: width ? parseInt(width) : null,
            height: height ? parseInt(height) : null,
            isActive: true,
          },
        });
      }

      res.status(201).json({
        success: true,
        message: 'Logo başarıyla oluşturuldu',
        data: logo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update logo (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('logos'),
  [
    body('name').optional().notEmpty(),
    body('alt').optional().isString(),
    body('width').optional().isInt(),
    body('height').optional().isInt(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, alt, width, height } = req.body;

      const logo = await prisma.logo.findUnique({
        where: { id },
      });

      if (!logo) {
        throw new AppError('Logo bulunamadı', 404);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (alt !== undefined) updateData.alt = alt;
      if (width !== undefined) updateData.width = parseInt(width);
      if (height !== undefined) updateData.height = parseInt(height);

      // If new file uploaded, update URL
      if (req.file) {
        updateData.url = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }

      const updated = await prisma.logo.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Logo başarıyla güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete logo (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const logo = await prisma.logo.findUnique({
        where: { id },
      });

      if (!logo) {
        throw new AppError('Logo bulunamadı', 404);
      }

      await prisma.logo.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Logo başarıyla silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Toggle logo active status (Admin only)
router.patch(
  '/:id/toggle',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const logo = await prisma.logo.findUnique({
        where: { id },
      });

      if (!logo) {
        throw new AppError('Logo bulunamadı', 404);
      }

      const updated = await prisma.logo.update({
        where: { id },
        data: {
          isActive: !logo.isActive,
        },
      });

      res.json({
        success: true,
        message: `Logo ${updated.isActive ? 'aktif' : 'pasif'} edildi`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

