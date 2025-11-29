import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Get all skills (Public)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const skills = await prisma.skill.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });

      res.json({
        success: true,
        data: skills,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single skill
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const skill = await prisma.skill.findUnique({
        where: { id },
      });

      if (!skill) {
        throw new AppError('Skill not found', 404);
      }

      res.json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create skill (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  [
    body('percentage').isInt({ min: 0, max: 100 }).withMessage('Yüzdelik 0-100 arası olmalıdır'),
    body('title').notEmpty().withMessage('Başlık gereklidir'),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { percentage, title, order, isActive } = req.body;

      const skill = await prisma.skill.create({
        data: {
          percentage: parseInt(percentage),
          title,
          order: order || 0,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Uzmanlık alanı başarıyla oluşturuldu',
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update skill (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    body('percentage').optional().isInt({ min: 0, max: 100 }),
    body('title').optional().notEmpty(),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { percentage, title, order, isActive } = req.body;

      const skill = await prisma.skill.findUnique({
        where: { id },
      });

      if (!skill) {
        throw new AppError('Skill not found', 404);
      }

      const updateData: any = {};
      if (percentage !== undefined) updateData.percentage = parseInt(percentage);
      if (title !== undefined) updateData.title = title;
      if (order !== undefined) updateData.order = parseInt(order);
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.skill.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Uzmanlık alanı güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete skill (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const skill = await prisma.skill.findUnique({
        where: { id },
      });

      if (!skill) {
        throw new AppError('Skill not found', 404);
      }

      await prisma.skill.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Uzmanlık alanı silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

