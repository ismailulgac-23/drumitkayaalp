import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Uploads klasörünü oluştur
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Map fieldnames to folder names
    let folderName = file.fieldname || 'general';
    
    // Special mappings for specific fieldnames
    if (file.fieldname === 'beforeImage' || file.fieldname === 'afterImage') {
      folderName = 'before-after';
    }
    
    const uploadPath = path.join(uploadsDir, folderName);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir (jpeg, jpg, png, gif, webp, svg)'));
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// Multiple file upload
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => {
  return upload.array(fieldName, maxCount);
};

// Single file upload
export const uploadSingle = (fieldName: string = 'image') => {
  return upload.single(fieldName);
};

// Fields upload (multiple fields)
export const uploadFields = (fields: { name: string; maxCount?: number }[]) => {
  return upload.fields(fields);
};

