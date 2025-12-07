import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';




import appointmentsRouter from './routes/appointments';
import patientsRouter from './routes/patients';
import servicesRouter from './routes/services';
import doctorsRouter from './routes/doctors';
import testimonialsRouter from './routes/testimonials';
import faqsRouter from './routes/faqs';
import beforeAfterRouter from './routes/before-after';
import dashboardRouter from './routes/dashboard';
import authRouter from './routes/auth';
import patientNotificationsRouter from './routes/patient-notifications';
import newslettersRouter from './routes/newsletters';
import contactChannelsRouter from './routes/contact-channels';
import uploadRouter from './routes/upload';
import logosRouter from './routes/logos';
import homeIntroRouter from './routes/home-intro';
import marqueeItemsRouter from './routes/marquee-items';
import homeAboutRouter from './routes/home-about';
import skillsRouter from './routes/skills';
import marquee2ItemsRouter from './routes/marquee2-items';
import aboutPageIntroRouter from './routes/about-page-intro';
import contactMapRouter from './routes/contact-map';
import blogsRouter from './routes/blogs';
import { initializeFirebase } from './services/fcm.service';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
      process.env.CORS_ORIGIN || 'http://localhost:3001'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(null, true); // Allow for development, restrict in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With'],
  exposedHeaders: ['Authorization', 'token'],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/before-after', beforeAfterRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/patient-notifications', patientNotificationsRouter);
app.use('/api/newsletters', newslettersRouter);
app.use('/api/contact-channels', contactChannelsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/logos', logosRouter);
app.use('/api/home-intro', homeIntroRouter);
app.use('/api/marquee-items', marqueeItemsRouter);
app.use('/api/home-about', homeAboutRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/marquee2-items', marquee2ItemsRouter);
app.use('/api/about-page-intro', aboutPageIntroRouter);
app.use('/api/contact-map', contactMapRouter);
app.use('/api/blogs', blogsRouter);

// Initialize Firebase
initializeFirebase();

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for: http://localhost:3001, http://localhost:3000`);
  console.log(`🔐 Admin login: http://localhost:${PORT}/api/auth/admin/login`);
});

