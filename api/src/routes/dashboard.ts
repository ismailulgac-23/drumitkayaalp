import { Router, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

// Get dashboard statistics (Admin only)
router.get(
  '/statistics',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get last 30 days patients count
      const last30DaysPatients = await prisma.patient.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      // Get today's patients count
      const todayPatients = await prisma.patient.count({
        where: {
          createdAt: {
            gte: todayStart,
          },
        },
      });

      // Get total revenue (from completed appointments with service price)
      const completedAppointments = await prisma.appointment.findMany({
        where: {
          status: 'Tamamlandı',
        },
        include: {
          service: true,
        },
      });

      const totalRevenue = completedAppointments.reduce((sum, apt) => {
        return sum + (apt.service?.price || 0);
      }, 0);

      // Get today's revenue
      const todayAppointments = await prisma.appointment.findMany({
        where: {
          status: 'Tamamlandı',
          date: {
            gte: todayStart,
          },
        },
        include: {
          service: true,
        },
      });

      const todayRevenue = todayAppointments.reduce((sum, apt) => {
        return sum + (apt.service?.price || 0);
      }, 0);

      // Get total procedures (completed appointments)
      const totalProcedures = completedAppointments.length;

      // Get pending appointments
      const pendingAppointments = await prisma.appointment.count({
        where: {
          status: 'Bekliyor',
        },
      });

      // Get completed appointments count
      const completedAppointmentsCount = completedAppointments.length;

      // Get active patients (patients with at least one appointment)
      const activePatients = await prisma.patient.count({
        where: {
          appointments: {
            some: {},
          },
        },
      });

      // Get daily patient data for last 30 days
      const dailyPatientData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const count = await prisma.patient.count({
          where: {
            createdAt: {
              gte: dayStart,
              lt: dayEnd,
            },
          },
        });

        dailyPatientData.push({
          date: String(date.getDate()).padStart(2, '0'),
          count,
        });
      }

      res.json({
        success: true,
        data: {
          last30DaysPatients,
          totalRevenue,
          totalProcedures,
          todayPatients,
          todayRevenue,
          pendingAppointments,
          completedAppointments: completedAppointmentsCount,
          activePatients,
          dailyPatientData,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

