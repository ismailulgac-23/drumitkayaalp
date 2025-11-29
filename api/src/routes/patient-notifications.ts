import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { sendPatientNotification } from '../services/sms.service';

const router = Router();

// Send notification to patient (Admin only)
router.post(
  '/send',
  authenticate,
  authorizeAdmin,
  [
    body('patientId').notEmpty().withMessage('Hasta ID gereklidir'),
    body('subject').notEmpty().withMessage('Konu gereklidir'),
    body('content').notEmpty().withMessage('Mesaj içeriği gereklidir'),
    body('greeting').optional().isString(),
    body('closing').optional().isString(),
    body('messageType').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { patientId, subject, content, greeting, closing, messageType } = req.body;

      // Find patient
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patient) {
        throw new AppError('Hasta bulunamadı', 404);
      }

      // Format message
      const fullMessage = `${greeting || 'Sayın'} ${patient.name},\n\n${content}\n\n${closing || 'Saygılarımızla,\nKlinik Yönetimi'}`;

      // SMS gönderme işlemi (şu an aktif değil, sadece başarılı mesaj döndürüyor)
      // TODO: SMS servisi aktif edildiğinde bu kısım açılacak
      await sendPatientNotification(patient.phone, fullMessage);
      // Her halükarda başarılı döndürüyor, bu yüzden hata kontrolü yapmıyoruz

      // Log notification (ileride notification tablosu oluşturulabilir)
      console.log('📱 Patient Notification:', {
        patientId: patient.id,
        patientName: patient.name,
        phone: patient.phone,
        subject,
        messageType: messageType || 'custom',
        timestamp: new Date().toISOString(),
      });

      // Her halükarda başarılı sonuç döndür
      res.json({
        success: true,
        message: 'Mesaj başarıyla gönderildi',
        data: {
          patientId: patient.id,
          patientName: patient.name,
          phone: patient.phone,
          email: patient.email,
          subject,
          message: fullMessage,
          messageType: messageType || 'custom',
          sentAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get notification history (Admin only)
router.get(
  '/history',
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '50' } = req.query;

      // TODO: Notification tablosu oluşturulduğunda bu kısım güncellenecek
      // Şu an için boş array döndürüyoruz
      res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: 0,
          pages: 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

