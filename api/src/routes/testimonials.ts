import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get all testimonials (Public for frontend)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.query;

      const where: any = {};
      
      // If not admin, only show active testimonials
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        where.isActive = true;
      } else {
        if (isActive !== undefined) {
          where.isActive = isActive === 'true';
        }
      }

      const testimonials = await prisma.testimonial.findMany({
        where,
        orderBy: { date: 'desc' },
      });

      res.json({
        success: true,
        data: testimonials,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single testimonial
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
      });

      if (!testimonial) {
        throw new AppError('Testimonial not found', 404);
      }

      res.json({
        success: true,
        data: testimonial,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create testimonial (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('avatar'),
  [
    body('patientName').notEmpty().withMessage('Hasta adı gereklidir'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Puan 1-5 arası olmalıdır'),
    body('comment').notEmpty().withMessage('Yorum gereklidir'),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { patientName, rating, comment, date, userId, isActive } = req.body;

      const avatarUrl = req.file ? `/uploads/${req.file.fieldname}/${req.file.filename}` : null;

      const testimonial = await prisma.testimonial.create({
        data: {
          patientName,
          rating: parseInt(rating),
          comment,
          avatarUrl,
          date: date ? new Date(date) : new Date(),
          userId: userId || null,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Yorum başarıyla oluşturuldu',
        data: testimonial,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update testimonial (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('avatar'),
  [
    body('patientName').optional().notEmpty(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional().notEmpty(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { patientName, rating, comment, date, isActive } = req.body;

      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
      });

      if (!testimonial) {
        throw new AppError('Testimonial not found', 404);
      }

      const updateData: any = {};
      if (patientName) updateData.patientName = patientName;
      if (rating !== undefined) updateData.rating = parseInt(rating);
      if (comment !== undefined) updateData.comment = comment;
      if (date !== undefined) updateData.date = new Date(date);
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
      
      // If new avatar uploaded, update avatarUrl
      if (req.file) {
        updateData.avatarUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }

      const updated = await prisma.testimonial.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Yorum güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete testimonial (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
      });

      if (!testimonial) {
        throw new AppError('Testimonial not found', 404);
      }

      await prisma.testimonial.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Yorum silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

