import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get all blogs (Public for frontend, Admin for management)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.query;

      const where: any = {};
      
      // If not admin, only show active blogs
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        where.isActive = true;
      } else {
        if (isActive !== undefined) {
          where.isActive = isActive === 'true';
        }
      }

      const blogs = await prisma.blog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: blogs,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single blog
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const blog = await prisma.blog.findUnique({
        where: { id },
      });

      if (!blog) {
        throw new AppError('Blog not found', 404);
      }

      res.json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create blog (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('blogs'),
  [
    body('title').notEmpty().withMessage('Blog başlığı gereklidir'),
    body('description').notEmpty().withMessage('Blog açıklaması gereklidir'),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description, isActive } = req.body;

      const imageUrl = req.file ? `/uploads/${req.file.fieldname}/${req.file.filename}` : null;

      const blog = await prisma.blog.create({
        data: {
          title,
          description,
          image: imageUrl,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Blog başarıyla oluşturuldu',
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update blog (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('blogs'),
  [
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, isActive } = req.body;

      const blog = await prisma.blog.findUnique({
        where: { id },
      });

      if (!blog) {
        throw new AppError('Blog not found', 404);
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (req.file) {
        updateData.image = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.blog.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Blog güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete blog (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const blog = await prisma.blog.findUnique({
        where: { id },
      });

      if (!blog) {
        throw new AppError('Blog not found', 404);
      }

      await prisma.blog.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Blog silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

