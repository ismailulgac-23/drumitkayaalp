import { Router, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Get all patients (Admin only)
router.get(
  '/',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { search, page = '1', limit = '50' } = req.query;

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          include: {
            appointments: {
              select: {
                id: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.patient.count({ where }),
      ]);

      // Add computed fields
      const patientsWithStats = patients.map((patient) => ({
        ...patient,
        totalAppointments: patient.appointments.length,
        totalProcedures: patient.appointments.filter((a) => a.status === 'Tamamlandı').length,
      }));

      res.json({
        success: true,
        data: patientsWithStats,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single patient (Admin only)
router.get(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          appointments: {
            orderBy: { date: 'desc' },
            include: {
              doctor: true,
              service: true,
            },
          },
        },
      });

      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      res.json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create patient (Admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  [
    body('name').notEmpty().withMessage('Ad Soyad gereklidir'),
    body('phone').notEmpty().withMessage('Telefon gereklidir'),
    body('email').optional().isEmail().withMessage('Geçerli bir email giriniz'),
    body('birthDate').optional().isISO8601(),
    body('gender').optional().isIn(['Erkek', 'Kadın']),
    body('address').optional().isString(),
    body('notes').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, phone, email, birthDate, gender, address, notes } = req.body;

      // Check if patient with phone already exists
      const existing = await prisma.patient.findFirst({
        where: { phone },
      });

      if (existing) {
        throw new AppError('Bu telefon numarası ile kayıtlı hasta zaten var', 400);
      }

      const patient = await prisma.patient.create({
        data: {
          name,
          phone,
          email: email || null,
          birthDate: birthDate ? new Date(birthDate) : null,
          gender: gender || null,
          address: address || null,
          notes: notes || null,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Hasta başarıyla oluşturuldu',
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update patient (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    body('name').optional().notEmpty(),
    body('phone').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('birthDate').optional().isISO8601(),
    body('gender').optional().isIn(['Erkek', 'Kadın']),
    body('address').optional().isString(),
    body('notes').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, phone, email, birthDate, gender, address, notes } = req.body;

      const patient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (email !== undefined) updateData.email = email;
      if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
      if (gender !== undefined) updateData.gender = gender;
      if (address !== undefined) updateData.address = address;
      if (notes !== undefined) updateData.notes = notes;

      const updated = await prisma.patient.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Hasta güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete patient (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const patient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      await prisma.patient.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Hasta silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

