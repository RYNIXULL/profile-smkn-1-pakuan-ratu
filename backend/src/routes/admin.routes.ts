import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { requireAdminOrHumas, requireSuperAdmin } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { sanitizeNewsContent } from '../middleware/sanitize';
import { multerUpload, processAndSaveImage, handleUploadErrors } from '../middleware/upload';
import {
  NewsCreateSchema,
  NewsUpdateSchema,
  EventCreateSchema,
  EventUpdateSchema,
  AnnouncementCreateSchema,
  AnnouncementUpdateSchema,
  AchievementCreateSchema,
  AchievementUpdateSchema,
  ProgramUpdateSchema,
  TeacherCreateSchema,
  TeacherUpdateSchema,
  FacilityCreateSchema,
  FacilityUpdateSchema,
  GalleryCreateSchema,
  GalleryUpdateSchema,
  UserCreateSchema,
  UserUpdateSchema,
} from '../validators';
import {
  getAdminNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../services/news.service';
import { getAdminPrograms, updateProgram } from '../services/program.service';
import { getAdminEvents, createEvent, updateEvent, deleteEvent } from '../services/event.service';
import {
  getAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../services/announcement.service';
import {
  getAdminAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../services/achievement.service';
import {
  getAdminTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../services/teacher.service';
import {
  getAdminFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
} from '../services/facility.service';
import {
  getAdminGalleries,
  createGallery,
  addMediaToGallery,
  removeMediaFromGallery,
  deleteGallery,
} from '../services/gallery.service';
import {
  getAdminMedia,
  saveMediaRecord,
  deleteMediaRecord,
} from '../services/media.service';
import { getAdminPages, updatePage } from '../services/page.service';
import { getAdminHomepageSections, updateHomepageSection } from '../services/homepage.service';
import {
  getAdminContactMessages,
  markContactMessageRead,
  deleteContactMessage,
} from '../services/contact.service';
import {
  getAllUsers,
  getAllRoles,
  createUser,
  updateUser,
  deleteUser,
  getAuditLogs,
} from '../services/user.service';
import { getAdminSettings, updateSettings } from '../services/setting.service';
import { prisma } from '../config/database';
import { apiSuccess, apiError } from '../utils/response';
import { NewsStatus } from '@prisma/client';

export const adminRouter = Router();

// Apply Authentication on ALL admin routes
adminRouter.use(authenticate);

// Helper for client IP & User-Agent
function getClientMeta(req: AuthenticatedRequest) {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  return { ipAddress, userAgent };
}

// ===================================================================
// 1. DASHBOARD OVERVIEW STATS
// ===================================================================
adminRouter.get('/dashboard/stats', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalNews,
      draftNews,
      publishedNews,
      upcomingEvents,
      totalAchievements,
      totalMedia,
      unreadMessages,
      recentAudits,
    ] = await Promise.all([
      prisma.news.count(),
      prisma.news.count({ where: { status: NewsStatus.DRAFT } }),
      prisma.news.count({ where: { status: NewsStatus.PUBLISHED } }),
      prisma.event.count({ where: { startDate: { gte: new Date() } } }),
      prisma.achievement.count(),
      prisma.media.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.auditLog.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    apiSuccess(res, {
      news: { total: totalNews, draft: draftNews, published: publishedNews },
      upcomingEvents,
      totalAchievements,
      totalMedia,
      unreadMessages,
      recentAudits,
    }, 'Statistik dashboard berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'DASHBOARD_STATS_FAILED', null, 500);
  }
});

// ===================================================================
// 2. NEWS MANAGEMENT (Workflow: Draft -> Review -> Published -> Archived)
// ===================================================================
adminRouter.get('/news', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const status = req.query.status as NewsStatus | undefined;
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;

    const result = await getAdminNews({ page, limit, status, search, categoryId });
    apiSuccess(res, result, 'Daftar berita admin berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'ADMIN_NEWS_FAILED', null, 500);
  }
});

adminRouter.get('/news/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const item = await getNewsById(req.params.id);
    if (!item) {
      apiError(res, 'Berita tidak ditemukan.', 'NOT_FOUND', null, 404);
      return;
    }
    apiSuccess(res, item, 'Detail berita berhasil diambil.');
  } catch (error: any) {
    apiError(res, error.message, 'ADMIN_NEWS_FAILED', null, 500);
  }
});

adminRouter.post(
  '/news',
  requireAdminOrHumas,
  validate(NewsCreateSchema),
  sanitizeNewsContent,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createNews(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Berita berhasil disimpan.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_NEWS_FAILED', null, 400);
    }
  }
);

adminRouter.patch(
  '/news/:id',
  requireAdminOrHumas,
  validate(NewsUpdateSchema),
  sanitizeNewsContent,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateNews(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Berita berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_NEWS_FAILED', null, 400);
    }
  }
);

adminRouter.delete('/news/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteNews(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Berita berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_NEWS_FAILED', null, 400);
  }
});

// ===================================================================
// 3. MEDIA LIBRARY & UPLOAD
// ===================================================================
adminRouter.get('/media', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 24;
    const search = req.query.search as string | undefined;
    const mimeType = req.query.mimeType as string | undefined;

    const result = await getAdminMedia({ page, limit, search, mimeType });
    apiSuccess(res, result, 'Media library berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_MEDIA_FAILED', null, 500);
  }
});

adminRouter.post(
  '/media/upload',
  requireAdminOrHumas,
  multerUpload.array('files', 10),
  handleUploadErrors,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        apiError(res, 'Silakan pilih file gambar untuk diunggah.', 'NO_FILES_UPLOADED', null, 400);
        return;
      }

      const { ipAddress, userAgent } = getClientMeta(req);
      const results = [];

      for (const file of files) {
        const processed = await processAndSaveImage(file);
        const record = await saveMediaRecord(
          processed,
          req.user?.userId,
          ipAddress,
          userAgent
        );
        results.push(record);
      }

      apiSuccess(res, results, `${results.length} media berhasil diunggah dan dioptimasi.`, 201);
    } catch (error: any) {
      apiError(res, error.message || 'Gagal memproses upload media.', 'UPLOAD_FAILED', null, 500);
    }
  }
);

adminRouter.delete('/media/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteMediaRecord(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Media berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_MEDIA_FAILED', null, 400);
  }
});

// ===================================================================
// 4. PROGRAM KEAHLIAN
// ===================================================================
adminRouter.get('/programs', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const programs = await getAdminPrograms();
    apiSuccess(res, programs, 'Data program keahlian berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_PROGRAMS_FAILED', null, 500);
  }
});

adminRouter.patch(
  '/programs/:id',
  requireAdminOrHumas,
  validate(ProgramUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateProgram(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Program keahlian berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_PROGRAM_FAILED', null, 400);
    }
  }
);

// ===================================================================
// 5. EVENTS & AGENDA
// ===================================================================
adminRouter.get('/events', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const events = await getAdminEvents();
    apiSuccess(res, events, 'Agenda kegiatan berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_EVENTS_FAILED', null, 500);
  }
});

adminRouter.post(
  '/events',
  requireAdminOrHumas,
  validate(EventCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createEvent(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Agenda baru berhasil ditambahkan.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_EVENT_FAILED', null, 400);
    }
  }
);

adminRouter.patch(
  '/events/:id',
  requireAdminOrHumas,
  validate(EventUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateEvent(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Agenda berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_EVENT_FAILED', null, 400);
    }
  }
);

adminRouter.delete('/events/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteEvent(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Agenda berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_EVENT_FAILED', null, 400);
  }
});

// ===================================================================
// 6. ANNOUNCEMENTS / PENGUMUMAN
// ===================================================================
adminRouter.get('/announcements', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const announcements = await getAdminAnnouncements();
    apiSuccess(res, announcements, 'Daftar pengumuman berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_ANNOUNCEMENTS_FAILED', null, 500);
  }
});

adminRouter.post(
  '/announcements',
  requireAdminOrHumas,
  validate(AnnouncementCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createAnnouncement(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Pengumuman berhasil diterbitkan.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_ANNOUNCEMENT_FAILED', null, 400);
    }
  }
);

adminRouter.patch(
  '/announcements/:id',
  requireAdminOrHumas,
  validate(AnnouncementUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateAnnouncement(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Pengumuman berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_ANNOUNCEMENT_FAILED', null, 400);
    }
  }
);

adminRouter.delete('/announcements/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteAnnouncement(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Pengumuman berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_ANNOUNCEMENT_FAILED', null, 400);
  }
});

// ===================================================================
// 7. ACHIEVEMENTS / PRESTASI
// ===================================================================
adminRouter.get('/achievements', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const achievements = await getAdminAchievements();
    apiSuccess(res, achievements, 'Data prestasi berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_ACHIEVEMENTS_FAILED', null, 500);
  }
});

adminRouter.post(
  '/achievements',
  requireAdminOrHumas,
  validate(AchievementCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createAchievement(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Prestasi baru berhasil ditambahkan.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_ACHIEVEMENT_FAILED', null, 400);
    }
  }
);

adminRouter.patch(
  '/achievements/:id',
  requireAdminOrHumas,
  validate(AchievementUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateAchievement(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Prestasi berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_ACHIEVEMENT_FAILED', null, 400);
    }
  }
);

adminRouter.delete('/achievements/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteAchievement(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Prestasi berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_ACHIEVEMENT_FAILED', null, 400);
  }
});

// ===================================================================
// 8. TEACHERS & FACILITIES
// ===================================================================
adminRouter.get('/teachers', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const teachers = await getAdminTeachers();
    apiSuccess(res, teachers, 'Data guru berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_TEACHERS_FAILED', null, 500);
  }
});

adminRouter.post(
  '/teachers',
  requireAdminOrHumas,
  validate(TeacherCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createTeacher(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Guru berhasil ditambahkan.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_TEACHER_FAILED', null, 400);
    }
  }
);

adminRouter.patch(
  '/teachers/:id',
  requireAdminOrHumas,
  validate(TeacherUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateTeacher(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Data guru berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_TEACHER_FAILED', null, 400);
    }
  }
);

adminRouter.delete('/teachers/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteTeacher(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Data guru berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_TEACHER_FAILED', null, 400);
  }
});

adminRouter.get('/facilities', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const facilities = await getAdminFacilities();
    apiSuccess(res, facilities, 'Data sarana & fasilitas berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_FACILITIES_FAILED', null, 500);
  }
});

adminRouter.post(
  '/facilities',
  requireAdminOrHumas,
  validate(FacilityCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createFacility(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Fasilitas berhasil ditambahkan.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_FACILITY_FAILED', null, 400);
    }
  }
);

adminRouter.patch(
  '/facilities/:id',
  requireAdminOrHumas,
  validate(FacilityUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateFacility(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Fasilitas berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_FACILITY_FAILED', null, 400);
    }
  }
);

adminRouter.delete('/facilities/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteFacility(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Fasilitas berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_FACILITY_FAILED', null, 400);
  }
});

// ===================================================================
// 9. GALLERIES & ALBUMS
// ===================================================================
adminRouter.get('/galleries', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const galleries = await getAdminGalleries();
    apiSuccess(res, galleries, 'Data album galeri berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_GALLERIES_FAILED', null, 500);
  }
});

adminRouter.post(
  '/galleries',
  requireAdminOrHumas,
  validate(GalleryCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createGallery(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Album galeri baru berhasil dibuat.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_GALLERY_FAILED', null, 400);
    }
  }
);

adminRouter.post('/galleries/:id/items', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mediaId, caption } = req.body;
    if (!mediaId) {
      apiError(res, 'Media ID wajib dipilih.', 'INVALID_INPUT', null, 400);
      return;
    }
    const item = await addMediaToGallery(req.params.id, mediaId, caption);
    apiSuccess(res, item, 'Foto berhasil dimasukkan ke dalam album.');
  } catch (error: any) {
    apiError(res, error.message, 'ADD_GALLERY_ITEM_FAILED', null, 400);
  }
});

adminRouter.delete('/galleries/:galleryId/items/:itemId', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await removeMediaFromGallery(req.params.galleryId, req.params.itemId);
    apiSuccess(res, null, 'Foto berhasil dikeluarkan dari album.');
  } catch (error: any) {
    apiError(res, error.message, 'REMOVE_GALLERY_ITEM_FAILED', null, 400);
  }
});

adminRouter.delete('/galleries/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteGallery(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Album galeri berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_GALLERY_FAILED', null, 400);
  }
});

// ===================================================================
// 10. HOMEPAGE MANAGEMENT & STATIC PAGES
// ===================================================================
adminRouter.get('/homepage', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const sections = await getAdminHomepageSections();
    apiSuccess(res, sections, 'Pengaturan seksi beranda berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_HOMEPAGE_SECTIONS_FAILED', null, 500);
  }
});

adminRouter.put('/homepage/:sectionKey', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const updated = await updateHomepageSection(
      req.params.sectionKey,
      req.body,
      req.user!.userId,
      ipAddress,
      userAgent
    );
    apiSuccess(res, updated, 'Seksi beranda berhasil diperbarui.');
  } catch (error: any) {
    apiError(res, error.message, 'UPDATE_HOMEPAGE_SECTION_FAILED', null, 400);
  }
});

adminRouter.get('/pages', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const pages = await getAdminPages();
    apiSuccess(res, pages, 'Daftar halaman statis berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_PAGES_FAILED', null, 500);
  }
});

adminRouter.patch('/pages/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const updated = await updatePage(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, updated, 'Konten halaman berhasil disimpan.');
  } catch (error: any) {
    apiError(res, error.message, 'UPDATE_PAGE_FAILED', null, 400);
  }
});

// ===================================================================
// 11. CONTACT MESSAGES
// ===================================================================
adminRouter.get('/contacts', requireAdminOrHumas, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = await getAdminContactMessages();
    apiSuccess(res, messages, 'Pesan masuk berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_CONTACTS_FAILED', null, 500);
  }
});

adminRouter.patch('/contacts/:id/read', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await markContactMessageRead(req.params.id, req.user!.userId);
    apiSuccess(res, updated, 'Pesan ditandai telah dibaca.');
  } catch (error: any) {
    apiError(res, error.message, 'UPDATE_CONTACT_FAILED', null, 400);
  }
});

adminRouter.delete('/contacts/:id', requireAdminOrHumas, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteContactMessage(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Pesan kontak berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_CONTACT_FAILED', null, 400);
  }
});

// ===================================================================
// 12. USER MANAGEMENT & AUDIT LOGS (SUPER ADMIN ONLY)
// ===================================================================
adminRouter.get('/users', requireSuperAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    apiSuccess(res, users, 'Daftar pengguna admin berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_USERS_FAILED', null, 500);
  }
});

adminRouter.get('/roles', requireSuperAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const roles = await getAllRoles();
    apiSuccess(res, roles, 'Daftar role berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_ROLES_FAILED', null, 500);
  }
});

adminRouter.post(
  '/users',
  requireSuperAdmin,
  validate(UserCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const created = await createUser(req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, created, 'Pengguna baru berhasil didaftarkan.', 201);
    } catch (error: any) {
      apiError(res, error.message, 'CREATE_USER_FAILED', null, 400);
    }
  }
);

adminRouter.patch(
  '/users/:id',
  requireSuperAdmin,
  validate(UserUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, userAgent } = getClientMeta(req);
      const updated = await updateUser(req.params.id, req.body, req.user!.userId, ipAddress, userAgent);
      apiSuccess(res, updated, 'Data pengguna berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message, 'UPDATE_USER_FAILED', null, 400);
    }
  }
);

adminRouter.delete('/users/:id', requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    await deleteUser(req.params.id, req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, null, 'Pengguna berhasil dihapus.');
  } catch (error: any) {
    apiError(res, error.message, 'DELETE_USER_FAILED', null, 400);
  }
});

adminRouter.get('/audit-logs', requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const logs = await getAuditLogs(limit);
    apiSuccess(res, logs, 'Audit log aktivitas administrator berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_AUDIT_LOGS_FAILED', null, 500);
  }
});

// ===================================================================
// 13. GLOBAL SETTINGS
// ===================================================================
adminRouter.get('/settings', requireSuperAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await getAdminSettings();
    apiSuccess(res, settings, 'Pengaturan sistem berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_SETTINGS_FAILED', null, 500);
  }
});

adminRouter.put('/settings', requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const updated = await updateSettings(req.body.settings || [], req.user!.userId, ipAddress, userAgent);
    apiSuccess(res, updated, 'Pengaturan sekolah berhasil diperbarui.');
  } catch (error: any) {
    apiError(res, error.message, 'UPDATE_SETTINGS_FAILED', null, 400);
  }
});
