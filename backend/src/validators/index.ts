import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
});

export const UserCreateSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  roleId: z.string().uuid('ID Role tidak valid'),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  password: z.string().min(8, 'Password minimal 8 karakter').optional(),
  roleId: z.string().uuid('ID Role tidak valid').optional(),
  isActive: z.boolean().optional(),
});

export const NewsCreateSchema = z.object({
  title: z.string().min(5, 'Judul berita minimal 5 karakter'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  summary: z.string().min(10, 'Ringkasan minimal 10 karakter'),
  content: z.string().min(20, 'Konten berita minimal 20 karakter'),
  thumbnailUrl: z.string().url('URL thumbnail harus valid').optional().nullable(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const NewsUpdateSchema = NewsCreateSchema.partial();

export const EventCreateSchema = z.object({
  title: z.string().min(3, 'Judul kegiatan minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  location: z.string().min(3, 'Lokasi kegiatan minimal 3 karakter'),
  startDate: z.string().datetime('Tanggal mulai harus format ISO valid'),
  endDate: z.string().datetime('Tanggal selesai harus format ISO valid').optional().nullable(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).default('UPCOMING'),
  imageUrl: z.string().url().optional().nullable(),
});

export const EventUpdateSchema = EventCreateSchema.partial();

export const AnnouncementCreateSchema = z.object({
  title: z.string().min(3, 'Judul pengumuman minimal 3 karakter'),
  content: z.string().min(10, 'Isi pengumuman minimal 10 karakter'),
  attachment: z.string().optional().nullable(),
  isUrgent: z.boolean().default(false),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const AnnouncementUpdateSchema = AnnouncementCreateSchema.partial();

export const AchievementCreateSchema = z.object({
  title: z.string().min(3, 'Nama prestasi minimal 3 karakter'),
  studentName: z.string().min(2, 'Nama siswa/tim minimal 2 karakter'),
  competition: z.string().min(3, 'Nama kompetisi minimal 3 karakter'),
  level: z.string().min(2, 'Tingkat kompetisi minimal 2 karakter'),
  category: z.string().min(2, 'Kategori lomba minimal 2 karakter'),
  year: z.number().int().min(2000).max(2100),
  description: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  isFeatured: z.boolean().default(false),
});

export const AchievementUpdateSchema = AchievementCreateSchema.partial();

export const ProgramUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  tagline: z.string().optional().nullable(),
  shortDesc: z.string().min(10).optional(),
  fullDesc: z.string().min(20).optional(),
  competencies: z.string().optional(),
  careerProspects: z.string().optional(),
  facilities: z.string().optional(),
  accentColor: z.string().optional().nullable(),
  iconName: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  orderIndex: z.number().int().optional(),
});

export const TeacherCreateSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  nip: z.string().optional().nullable(),
  position: z.string().min(2, 'Jabatan minimal 2 karakter'),
  subject: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  programId: z.string().uuid().optional().nullable(),
  isStaff: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
});

export const TeacherUpdateSchema = TeacherCreateSchema.partial();

export const FacilityCreateSchema = z.object({
  name: z.string().min(2, 'Nama fasilitas minimal 2 karakter'),
  category: z.string().min(2, 'Kategori fasilitas minimal 2 karakter'),
  description: z.string().min(5, 'Deskripsi fasilitas minimal 5 karakter'),
  location: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  orderIndex: z.number().int().default(0),
});

export const FacilityUpdateSchema = FacilityCreateSchema.partial();

export const GalleryCreateSchema = z.object({
  title: z.string().min(3, 'Judul album minimal 3 karakter'),
  description: z.string().optional().nullable(),
  category: z.string().default('Kegiatan'),
  coverUrl: z.string().url().optional().nullable(),
});

export const GalleryUpdateSchema = GalleryCreateSchema.partial();

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().max(20).optional().nullable(),
  subject: z.string().min(3, 'Subjek minimal 3 karakter').max(150),
  message: z.string().min(10, 'Pesan minimal 10 karakter').max(2000),
});
