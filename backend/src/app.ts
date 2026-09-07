import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { apiSuccess, apiError } from './utils/response';
import { generateSitemapXml, generateRobotsTxt } from './services/sitemap.service';

export const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: config.isProduction ? undefined : false,
  })
);

// 2. Strict CORS Configuration
app.use(
  cors({
    origin: [config.cors.origin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Body parsers & Cookie parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookie.secret));

// 4. Rate Limiting for general API calls
app.use('/api', generalLimiter);

// 5. Static file serving for uploaded media
app.use('/uploads', express.static(config.upload.uploadDir));

// 6. Health check endpoint
app.get('/api/health', (_req, res) => {
  apiSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
    service: 'SMKN 1 Pakuan Ratu Backend API',
  });
});

// 6b. Sitemap.xml & Robots.txt for Search Engines
app.get(['/sitemap.xml', '/api/sitemap.xml', '/api/public/sitemap.xml'], async (_req, res) => {
  try {
    const xml = await generateSitemapXml();
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

app.get(['/robots.txt', '/api/robots.txt', '/api/public/robots.txt'], (_req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(generateRobotsTxt());
});

// 7. Mount Core REST API
app.use('/api', apiRouter);

// 8. 404 handler for API routes
app.use('/api/*', (_req, res) => {
  apiError(res, 'Endpoint API tidak ditemukan.', 'ENDPOINT_NOT_FOUND', null, 404);
});

// 9. Global Centralized Error Handler
app.use(errorHandler);
