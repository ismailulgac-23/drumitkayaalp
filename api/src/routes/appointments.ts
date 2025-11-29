import { Router, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Get all appointments (Admin only)
router.get(
  '/',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { search, status, page = '1', limit = '50' } = req.query;

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } },
          { doctorName: { contains: search as string, mode: 'insensitive' } },
          { serviceName: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (status && status !== 'all') {
        where.status = status;
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where,
          include: {
            patient: true,
            doctor: true,
            service: true,
          },
          orderBy: { date: 'desc' },
          skip,
          take,
        }),
        prisma.appointment.count({ where }),
      ]);

      res.json({
        success: true,
        data: appointments,
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

// Get single appointment (Admin only)
router.get(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          patient: true,
          doctor: true,
          service: true,
        },
      });

      if (!appointment) {
        throw new AppError('Appointment not found', 404);
      }

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create appointment (Public - from frontend form)
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Ad Soyad gereklidir'),
    body('phone').notEmpty().withMessage('Telefon gereklidir'),
    body('date').isISO8601().withMessage('Geçerli bir tarih giriniz'),
    body('time').notEmpty().withMessage('Saat gereklidir'),
    body('serviceId').optional().isUUID().withMessage('Geçerli bir hizmet ID giriniz'),
    body('doctorId').optional().isUUID().withMessage('Geçerli bir doktor ID giriniz'),
    body('serviceName').optional().isString(),
    body('doctorName').optional().isString(),
    body('email').optional().isEmail().withMessage('Geçerli bir email giriniz'),
    body('notes').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, phone, email, date, time, serviceId, doctorId, serviceName, doctorName, notes } = req.body;

      // Find or create patient
      let patient = await prisma.patient.findFirst({
        where: { phone },
      });

      if (!patient) {
        patient = await prisma.patient.create({
          data: {
            name,
            phone,
            email: email || null,
          },
        });
      } else {
        // Update patient info if needed
        patient = await prisma.patient.update({
          where: { id: patient.id },
          data: {
            name,
            email: email || patient.email,
          },
        });
      }

      // Validate doctorId if provided
      let validDoctorId = null;
      if (doctorId) {
        const doctorRecord = await prisma.doctor.findUnique({
          where: { id: doctorId },
        });
        if (doctorRecord && doctorRecord.isActive) {
          validDoctorId = doctorId;
        }
      }

      // Validate serviceId if provided
      let validServiceId = null;
      if (serviceId) {
        const serviceRecord = await prisma.service.findUnique({
          where: { id: serviceId },
        });
        if (serviceRecord && serviceRecord.isActive) {
          validServiceId = serviceId;
        }
      }

      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: validDoctorId,
          serviceId: validServiceId,
          name,
          phone,
          email: email || null,
          date: new Date(date),
          time,
          serviceName: serviceName || null,
          doctorName: doctorName || null,
          notes: notes || null,
          status: 'Planlandı',
        },
        include: {
          patient: true,
          doctor: true,
          service: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Randevu başarıyla oluşturuldu',
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update appointment (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    body('name').optional().notEmpty(),
    body('phone').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('date').optional().isISO8601(),
    body('time').optional().notEmpty(),
    body('status').optional().isIn(['Planlandı', 'Bekliyor', 'Tamamlandı', 'İptal']),
    body('notes').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, phone, email, date, time, status, notes, doctorId, serviceId } = req.body;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new AppError('Appointment not found', 404);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (email !== undefined) updateData.email = email;
      if (date) updateData.date = new Date(date);
      if (time) updateData.time = time;
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;
      if (doctorId !== undefined) updateData.doctorId = doctorId;
      if (serviceId !== undefined) updateData.serviceId = serviceId;

      const updated = await prisma.appointment.update({
        where: { id },
        data: updateData,
        include: {
          patient: true,
          doctor: true,
          service: true,
        },
      });

      res.json({
        success: true,
        message: 'Randevu güncellendi',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete appointment (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new AppError('Appointment not found', 404);
      }

      await prisma.appointment.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Randevu silindi',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

