import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Get all doctors (Public for frontend)
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.query;

      const where: any = {};
      
      // If not admin, only show active doctors
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        where.isActive = true;
      } else {
        if (isActive !== undefined) {
          where.isActive = isActive === 'true';
        }
      }

      const doctors = await prisma.doctor.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: doctors,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single doctor
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const doctor = await prisma.doctor.findUnique({
        where: { id },
      });

      if (!doctor) {
        throw new AppError('Doctor not found', 404);
      }

      res.json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create doctor (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadSingle('doctors'),
  [
    body('name').notEmpty().withMessage('Doktor adı gereklidir'),
    body('email').optional().isEmail().withMessage('Geçerli bir email giriniz'),
    body('phone').optional().isString(),
    body('specialty').optional().isString(),
    body('bio').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, email, phone, specialty, bio, isActive } = req.body;

      const imageUrl = req.file ? `/uploads/${req.file.fieldname}/${req.file.filename}` : null;

      const doctor = await prisma.doctor.create({
        data: {
          name,
          email: email || null,
          phone: phone || null,
          specialty: specialty || null,
          bio: bio || null,
          image: imageUrl,
          isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Doktor başarıyla oluşturuldu',
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update doctor (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadSingle('doctors'),
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('phone').optional().isString(),
    body('specialty').optional().isString(),
    body('bio').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, email, phone, specialty, bio, isActive } = req.body;

      const doctor = await prisma.doctor.findUnique({
        where: { id },
      });

      if (!doctor) {
        throw new AppError('Doctor not found', 404);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (specialty !== undefined) updateData.specialty = specialty;
      if (bio !== undefined) updateData.bio = bio;
      if (req.file) {
        updateData.image = `/uploads/${req.file.fieldname}/${req.file.filename}`;
      }
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const updated = await prisma.doctor.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Doktor güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete doctor (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const doctor = await prisma.doctor.findUnique({
        where: { id },
      });

      if (!doctor) {
        throw new AppError('Doctor not found', 404);
      }

      await prisma.doctor.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Doktor silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

