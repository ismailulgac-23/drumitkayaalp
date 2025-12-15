import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Get all FAQs (Public for frontend)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.query;

      const where: any = {};
      
      // If not admin, only show active FAQs
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        where.isActive = true;
      } else {
        if (isActive !== undefined) {
          where.isActive = isActive === 'true';
        }
      }

      const faqs = await prisma.fAQ.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });

      res.json({
        success: true,
        data: faqs,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single FAQ
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const faq = await prisma.fAQ.findUnique({
        where: { id },
      });

      if (!faq) {
        throw new AppError('FAQ not found', 404);
      }

      res.json({
        success: true,
        data: faq,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create FAQ (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  [
    body('question').notEmpty().withMessage('Soru gereklidir'),
    body('answer').notEmpty().withMessage('Cevap gereklidir'),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { question, answer, order, isActive } = req.body;

      const faq = await prisma.fAQ.create({
        data: {
          question,
          answer,
          order: order ? Number(order) : 0,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'SSS başarıyla oluşturuldu',
        data: faq,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update FAQ (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    body('question').optional().notEmpty(),
    body('answer').optional().notEmpty(),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { question, answer, order, isActive } = req.body;

      const faq = await prisma.fAQ.findUnique({
        where: { id },
      });

      if (!faq) {
        throw new AppError('FAQ not found', 404);
      }

      const updateData: any = {};
      if (question) updateData.question = question;
      if (answer !== undefined) updateData.answer = answer;
      if (order !== undefined) updateData.order = parseInt(order);
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.fAQ.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'SSS güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete FAQ (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const faq = await prisma.fAQ.findUnique({
        where: { id },
      });

      if (!faq) {
        throw new AppError('FAQ not found', 404);
      }

      await prisma.fAQ.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'SSS silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

