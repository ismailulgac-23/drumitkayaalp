import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get all services (Public for frontend, Admin for management)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.query;

      const where: any = {};
      
      // If not admin, only show active services
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        where.isActive = true;
      } else {
        if (isActive !== undefined) {
          where.isActive = isActive === 'true';
        }
      }

      const services = await prisma.service.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });

      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single service
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new AppError('Service not found', 404);
      }

      res.json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create service (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('services'),
  [
    body('title').notEmpty().withMessage('Hizmet adı gereklidir'),
    body('description').optional().isString(),
    body('price').optional().isFloat({ min: 0 }),
    body('duration').optional().isString(),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description, price, duration, order, isActive } = req.body;

      const imageUrl = req.file ? `/uploads/${req.file.fieldname}/${req.file.filename}` : null;

      const service = await prisma.service.create({
        data: {
          title,
          description: description || null,
          price: price ? parseFloat(price) : null,
          duration: duration || null,
          image: imageUrl,
          order: order || 0,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Hizmet başarıyla oluşturuldu',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update service (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('services'),
  [
    body('title').optional().notEmpty(),
    body('description').optional().isString(),
    body('price').optional().isFloat({ min: 0 }),
    body('duration').optional().isString(),
    body('order').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, price, duration, order, isActive } = req.body;

      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new AppError('Service not found', 404);
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price ? parseFloat(price) : null;
      if (duration !== undefined) updateData.duration = duration;
      if (req.file) {
        updateData.image = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }
      if (order !== undefined) updateData.order = parseInt(order);
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.service.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Hizmet güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete service (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new AppError('Service not found', 404);
      }

      await prisma.service.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Hizmet silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

