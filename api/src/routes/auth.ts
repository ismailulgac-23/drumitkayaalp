import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Admin Login - Email/Password ile
router.post(
  '/admin/login',
  [
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError('Email veya şifre hatalı', 401);
      }

      // Check if user is admin
      if (!user.isAdmin) {
        throw new AppError('Bu hesap admin yetkisine sahip değil', 403);
      }

      // Check if user has password
      if (!user.password) {
        throw new AppError('Bu hesap için şifre tanımlanmamış. Lütfen şifre belirleyin.', 401);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Email veya şifre hatalı', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError('Hesabınız pasif durumda', 403);
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, userType: user.userType, isAdmin: user.isAdmin },
        process.env.JWT_SECRET ?? 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
      );

      res.json({
        success: true,
        message: 'Giriş başarılı',
        data: {
          token,
          user: {
            id: user.id,
            phoneNumber: user.phoneNumber,
            name: user.name,
            email: user.email,
            userType: user.userType,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            profileImage: user.profileImage,
            companyName: user.companyName,
            address: user.address,
            bio: user.bio,
            location: user.location,
            rating: user.rating,
            ratingCount: user.ratingCount,
            responseTime: user.responseTime,
            memberSince: user.memberSince,
            completedJobs: user.completedJobs,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin Me - Get current admin user
router.get(
  '/admin/me',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || req.headers.token;
      
      if (!authHeader) {
        throw new AppError('Authentication required', 401);
      }

      const token = typeof authHeader === 'string' 
        ? (authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader)
        : '';

      if (!token || token.trim() === '') {
        throw new AppError('Authentication required', 401);
      }

      const jwtSecret = process.env.JWT_SECRET || 'secret';
      const decoded = jwt.verify(token, jwtSecret) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (!user.isAdmin) {
        throw new AppError('Access denied. Admin role required.', 403);
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
          profileImage: user.profileImage,
          companyName: user.companyName,
          address: user.address,
          bio: user.bio,
          location: user.location,
          rating: user.rating,
          ratingCount: user.ratingCount,
          responseTime: user.responseTime,
          memberSince: user.memberSince,
          completedJobs: user.completedJobs,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

