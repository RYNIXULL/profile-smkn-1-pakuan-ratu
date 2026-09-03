import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { apiError } from '../utils/response';

// Ensure upload directory exists
if (!fs.existsSync(config.upload.uploadDir)) {
  fs.mkdirSync(config.upload.uploadDir, { recursive: true });
}

// Multer in-memory storage for inspection
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipe file tidak diizinkan: ${file.mimetype}. Hanya JPG, PNG, dan WebP yang diperbolehkan.`));
  }
};

export const multerUpload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize, // 5MB limit
    files: 10, // Max 10 files per multi-upload
  },
  fileFilter,
});

export interface ProcessedFile {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export async function processAndSaveImage(file: Express.Multer.File): Promise<ProcessedFile> {
  const randomName = crypto.randomBytes(16).toString('hex');
  const filename = `${randomName}.webp`;
  const filePath = path.join(config.upload.uploadDir, filename);

  // Sharp inspects the buffer and reprocesses it to WebP (stripping EXIF metadata & script payloads)
  const image = sharp(file.buffer);
  const metadata = await image.metadata();

  if (!metadata.format || !['jpeg', 'jpg', 'png', 'webp'].includes(metadata.format)) {
    throw new Error('File gambar korup atau bukan format gambar valid.');
  }

  // Resize if wider than 1920px, convert to WebP with 85% quality
  const transformedBuffer = await image
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  await fs.promises.writeFile(filePath, transformedBuffer);

  const finalMetadata = await sharp(transformedBuffer).metadata();

  return {
    filename,
    originalName: path.basename(file.originalname).slice(0, 100),
    path: filePath,
    url: `/uploads/${filename}`,
    mimeType: 'image/webp',
    sizeBytes: transformedBuffer.length,
    width: finalMetadata.width,
    height: finalMetadata.height,
  };
}

export function handleUploadErrors(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      apiError(res, 'Ukuran file terlalu besar. Maksimal 5MB.', 'FILE_TOO_LARGE', null, 400);
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      apiError(res, 'Terlalu banyak file sekaligus. Maksimal 10 file per upload.', 'TOO_MANY_FILES', null, 400);
      return;
    }
    apiError(res, `Gagal mengunggah file: ${err.message}`, 'UPLOAD_ERROR', null, 400);
    return;
  }
  if (err) {
    apiError(res, err.message || 'Gagal memproses file upload.', 'UPLOAD_ERROR', null, 400);
    return;
  }
  next();
}
