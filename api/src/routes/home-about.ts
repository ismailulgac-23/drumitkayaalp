import { Router, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get home about (Public)
router.get(
  '/',
  // @ts-ignore
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const about = await prisma.homeAbout.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      });

      res.json({
        success: true,
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all home abouts (Admin)
router.get(
  '/all',
  authenticate,
  authorizeAdmin,
  // @ts-ignore
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const abouts = await prisma.homeAbout.findMany({
        orderBy: { updatedAt: 'desc' },
      });

      res.json({
        success: true,
        data: abouts,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create home about (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('about'),
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { smallTitle, title, content, isActive } = req.body;

      const image = req.file ? `/uploads/${req.file.fieldname}/${req.file.filename}` : null;

      const about = await prisma.homeAbout.create({
        data: {
          image,
          smallTitle: smallTitle || null,
          title: title || null,
          content: content || null,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Anasayfa about başarıyla oluşturuldu',
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update home about (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('about'),
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { smallTitle, title, content, isActive } = req.body;

      const about = await prisma.homeAbout.findUnique({
        where: { id },
      });

      if (!about) {
        throw new AppError('Home about not found', 404);
      }

      const updateData: any = {};
      if (smallTitle !== undefined) updateData.smallTitle = smallTitle;
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
      
      if (req.file) {
        updateData.image = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }

      const updated = await prisma.homeAbout.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Anasayfa about güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete home about (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const about = await prisma.homeAbout.findUnique({
        where: { id },
      });

      if (!about) {
        throw new AppError('Home about not found', 404);
      }

      await prisma.homeAbout.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Anasayfa about silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

