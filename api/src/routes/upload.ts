import { Router, Response, NextFunction } from 'express';
import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import { uploadSingle, uploadMultiple, uploadFields } from '../middleware/upload';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Single file upload
router.post(
  '/single',
  authenticate,
  authorizeAdmin,
  uploadSingle('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('Dosya yüklenmedi', 400);
      }

      const fileUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;

      res.json({
        success: true,
        message: 'Dosya başarıyla yüklendi',
        data: {
          url: fileUrl,
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Multiple files upload
router.post(
  '/multiple',
  authenticate,
  authorizeAdmin,
  uploadMultiple('images', 10),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        throw new AppError('Dosya yüklenmedi', 400);
      }

      const files = Array.isArray(req.files) ? req.files : [];
      const uploadedFiles = files.map((file) => ({
        url: `/uploads/${file.fieldname}/${file.filename}`,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));

      res.json({
        success: true,
        message: `${uploadedFiles.length} dosya başarıyla yüklendi`,
        data: uploadedFiles,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Fields upload (for multiple field names)
router.post(
  '/fields',
  authenticate,
  authorizeAdmin,
  uploadFields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const uploadedFiles: any = {};

      Object.keys(files).forEach((fieldname) => {
        uploadedFiles[fieldname] = files[fieldname].map((file) => ({
          url: `/uploads/${fieldname}/${file.filename}`,
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        }));
      });

      res.json({
        success: true,
        message: 'Dosyalar başarıyla yüklendi',
        data: uploadedFiles,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

