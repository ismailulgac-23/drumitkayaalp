import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get home intro (Public)
router.get(
  '/',
  // @ts-ignore
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const intro = await prisma.homeIntro.findFirst({
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

// Get all home intros (Admin)
router.get(
  '/all',
  authenticate,
  authorizeAdmin,
  // @ts-ignore
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const intros = await prisma.homeIntro.findMany({
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

// Create home intro (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('backgroundImage'),
  [
    body('mainTitle').notEmpty().withMessage('Ana başlık gereklidir'),
  ],
  validateRequest,
  // @ts-ignore
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { smallTitle, mainTitle, subTitle, description, buttonText, buttonLink, isActive } = req.body;

      const backgroundImage = req.file ? `/uploads/${req.file.fieldname}/${req.file.filename}` : null;

      const intro = await prisma.homeIntro.create({
        data: {
          smallTitle: smallTitle || null,
          mainTitle,
          subTitle: subTitle || null,
          description: description || null,
          buttonText: buttonText || null,
          buttonLink: buttonLink || null,
          backgroundImage,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Anasayfa intro başarıyla oluşturuldu',
        data: intro,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update home intro (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('backgroundImage'),
  [
    body('mainTitle').optional().notEmpty(),
  ],
  validateRequest,
  // @ts-ignore
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { smallTitle, mainTitle, subTitle, description, buttonText, buttonLink, isActive } = req.body;

      const intro = await prisma.homeIntro.findUnique({
        where: { id },
      });

      if (!intro) {
        throw new AppError('Home intro not found', 404);
      }

      const updateData: any = {};
      if (smallTitle !== undefined) updateData.smallTitle = smallTitle;
      if (mainTitle !== undefined) updateData.mainTitle = mainTitle;
      if (subTitle !== undefined) updateData.subTitle = subTitle;
      if (description !== undefined) updateData.description = description;
      if (buttonText !== undefined) updateData.buttonText = buttonText;
      if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
      
      if (req.file) {
        updateData.backgroundImage = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }

      const updated = await prisma.homeIntro.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Anasayfa intro güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete home intro (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const intro = await prisma.homeIntro.findUnique({
        where: { id },
      });

      if (!intro) {
        throw new AppError('Home intro not found', 404);
      }

      await prisma.homeIntro.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Anasayfa intro silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

