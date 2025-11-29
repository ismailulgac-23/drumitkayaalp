import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get about page intro (Public)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const intro = await prisma.aboutPageIntro.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      });

      res.json({
        success: true,
        data: intro,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all about page intros (Admin)
router.get(
  '/all',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const intros = await prisma.aboutPageIntro.findMany({
        orderBy: { updatedAt: 'desc' },
      });

      res.json({
        success: true,
        data: intros,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create about page intro (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('about-intro'),
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, content, isActive } = req.body;

      const image = req.file ? `/uploads/${req.file.fieldname}/${req.file.filename}` : null;

      const intro = await prisma.aboutPageIntro.create({
        data: {
          image,
          title: title || null,
          content: content || null,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Hakkımızda intro başarıyla oluşturuldu',
        data: intro,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update about page intro (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('about-intro'),
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, content, isActive } = req.body;

      const intro = await prisma.aboutPageIntro.findUnique({
        where: { id },
      });

      if (!intro) {
        throw new AppError('About page intro not found', 404);
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
      
      if (req.file) {
        updateData.image = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }

      const updated = await prisma.aboutPageIntro.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Hakkımızda intro güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete about page intro (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const intro = await prisma.aboutPageIntro.findUnique({
        where: { id },
      });

      if (!intro) {
        throw new AppError('About page intro not found', 404);
      }

      await prisma.aboutPageIntro.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Hakkımızda intro silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

