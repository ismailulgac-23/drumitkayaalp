import { Router, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Subscribe to newsletter (Public)
router.post(
  '/subscribe',
  [
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('name').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body;

      // Check if already subscribed
      const existing = await prisma.newsletter.findUnique({
        where: { email },
      });

      if (existing) {
        if (existing.isActive) {
          return res.json({
            success: true,
            message: 'Bu email adresi zaten bültenimize kayıtlı',
            data: existing,
          });
        } else {
          // Reactivate subscription
          const updated = await prisma.newsletter.update({
            where: { email },
            data: {
              isActive: true,
              name: name || existing.name,
              unsubscribedAt: null,
            },
          });

          return res.json({
            success: true,
            message: 'Bülten aboneliğiniz yeniden aktif edildi',
            data: updated,
          });
        }
      }

      // Create new subscription
      const newsletter = await prisma.newsletter.create({
        data: {
          email,
          name,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Bülten aboneliğiniz başarıyla oluşturuldu',
        data: newsletter,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Unsubscribe from newsletter (Public)
router.post(
  '/unsubscribe',
  [
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const newsletter = await prisma.newsletter.findUnique({
        where: { email },
      });

      if (!newsletter) {
        throw new AppError('Bu email adresi bültenimize kayıtlı değil', 404);
      }

      if (!newsletter.isActive) {
        return res.json({
          success: true,
          message: 'Bu email adresi zaten abonelikten çıkarılmış',
        });
      }

      await prisma.newsletter.update({
        where: { email },
        data: {
          isActive: false,
          unsubscribedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: 'Bülten aboneliğiniz iptal edildi',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all newsletters (Admin only)
router.get(
  '/',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '50', search, isActive } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (search) {
        where.OR = [
          { email: { contains: search as string, mode: 'insensitive' } },
          { name: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [newsletters, total] = await Promise.all([
        prisma.newsletter.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { subscribedAt: 'desc' },
        }),
        prisma.newsletter.count({ where }),
      ]);

      res.json({
        success: true,
        data: newsletters,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get newsletter by ID (Admin only)
router.get(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const newsletter = await prisma.newsletter.findUnique({
        where: { id },
      });

      if (!newsletter) {
        throw new AppError('Bülten kaydı bulunamadı', 404);
      }

      res.json({
        success: true,
        data: newsletter,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete newsletter (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const newsletter = await prisma.newsletter.findUnique({
        where: { id },
      });

      if (!newsletter) {
        throw new AppError('Bülten kaydı bulunamadı', 404);
      }

      await prisma.newsletter.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Bülten kaydı başarıyla silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Toggle newsletter active status (Admin only)
router.patch(
  '/:id/toggle',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const newsletter = await prisma.newsletter.findUnique({
        where: { id },
      });

      if (!newsletter) {
        throw new AppError('Bülten kaydı bulunamadı', 404);
      }

      const updated = await prisma.newsletter.update({
        where: { id },
        data: {
          isActive: !newsletter.isActive,
          unsubscribedAt: !newsletter.isActive ? null : new Date(),
        },
      });

      res.json({
        success: true,
        message: `Bülten kaydı ${updated.isActive ? 'aktif' : 'pasif'} edildi`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

