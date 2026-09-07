import { Router, Request, Response } from 'express';
import { getPublicNews, getPublicNewsBySlug, getPublicCategories } from '../services/news.service';
import { getPublicPrograms, getPublicProgramBySlug } from '../services/program.service';
import { getPublicEvents } from '../services/event.service';
import { getPublicAnnouncements } from '../services/announcement.service';
import { getPublicAchievements } from '../services/achievement.service';
import { getPublicTeachers } from '../services/teacher.service';
import { getPublicFacilities } from '../services/facility.service';
import { getPublicGalleries, getPublicGalleryBySlug } from '../services/gallery.service';
import { getPublicPageBySlug } from '../services/page.service';
import { getPublicHomepageSections } from '../services/homepage.service';
import { getPublicSettings } from '../services/setting.service';
import { submitContactMessage } from '../services/contact.service';
import { getPublicPpdbInfo, submitPpdbConsultation } from '../services/ppdb.service';
import { getPublicBkkInfo, submitTracerStudy } from '../services/bkk.service';
import { getPublicDownloads } from '../services/download.service';
import { searchPublic } from '../services/search.service';
import { validate } from '../middleware/validate';
import { contactLimiter } from '../middleware/rateLimiter';
import { ContactMessageSchema } from '../validators';
import { apiSuccess, apiError } from '../utils/response';

export const publicRouter = Router();

// 1. Homepage & Settings
publicRouter.get('/homepage', async (_req: Request, res: Response) => {
  try {
    const sections = await getPublicHomepageSections();
    apiSuccess(res, sections, 'Data seksi beranda berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_HOMEPAGE_FAILED', null, 500);
  }
});

publicRouter.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await getPublicSettings();
    apiSuccess(res, settings, 'Pengaturan publik berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_SETTINGS_FAILED', null, 500);
  }
});

// 2. Static Pages (Sejarah, Visi-Misi, Sambutan, Struktur)
publicRouter.get('/pages/:slug', async (req: Request, res: Response) => {
  try {
    const page = await getPublicPageBySlug(req.params.slug);
    if (!page) {
      apiError(res, 'Halaman tidak ditemukan.', 'NOT_FOUND', null, 404);
      return;
    }
    apiSuccess(res, page, 'Konten halaman berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_PAGE_FAILED', null, 500);
  }
});

// 3. News / Berita
publicRouter.get('/news', async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 9;
    const categorySlug = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const featured = req.query.featured === 'true' ? true : undefined;

    const result = await getPublicNews({ page, limit, categorySlug, search, featured });
    apiSuccess(res, result, 'Daftar berita publik berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_NEWS_FAILED', null, 500);
  }
});

publicRouter.get('/news-categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getPublicCategories();
    apiSuccess(res, categories, 'Kategori berita berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_CATEGORIES_FAILED', null, 500);
  }
});

publicRouter.get('/news/:slug', async (req: Request, res: Response) => {
  try {
    const result = await getPublicNewsBySlug(req.params.slug);
    if (!result) {
      apiError(res, 'Artikel berita tidak ditemukan atau belum dipublikasikan.', 'NOT_FOUND', null, 404);
      return;
    }
    apiSuccess(res, result, 'Detail berita berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_NEWS_DETAIL_FAILED', null, 500);
  }
});

// 4. Programs / Program Keahlian
publicRouter.get('/programs', async (_req: Request, res: Response) => {
  try {
    const programs = await getPublicPrograms();
    apiSuccess(res, programs, 'Daftar 5 program keahlian berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_PROGRAMS_FAILED', null, 500);
  }
});

publicRouter.get('/programs/:slug', async (req: Request, res: Response) => {
  try {
    const program = await getPublicProgramBySlug(req.params.slug);
    if (!program) {
      apiError(res, 'Program keahlian tidak ditemukan.', 'NOT_FOUND', null, 404);
      return;
    }
    apiSuccess(res, program, 'Detail program keahlian berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_PROGRAM_DETAIL_FAILED', null, 500);
  }
});

// 5. Events / Agenda
publicRouter.get('/events', async (req: Request, res: Response) => {
  try {
    const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const events = await getPublicEvents({ month, year });
    apiSuccess(res, events, 'Agenda kegiatan sekolah berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_EVENTS_FAILED', null, 500);
  }
});

// 6. Announcements / Pengumuman
publicRouter.get('/announcements', async (_req: Request, res: Response) => {
  try {
    const announcements = await getPublicAnnouncements();
    apiSuccess(res, announcements, 'Pengumuman resmi berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_ANNOUNCEMENTS_FAILED', null, 500);
  }
});

// 7. Achievements / Prestasi
publicRouter.get('/achievements', async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const level = req.query.level as string | undefined;
    const category = req.query.category as string | undefined;
    const achievements = await getPublicAchievements({ year, level, category });
    apiSuccess(res, achievements, 'Prestasi siswa berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_ACHIEVEMENTS_FAILED', null, 500);
  }
});

// 8. Teachers & Staff
publicRouter.get('/teachers', async (req: Request, res: Response) => {
  try {
    const isStaff = req.query.staff === 'true' ? true : req.query.staff === 'false' ? false : undefined;
    const programSlug = req.query.program as string | undefined;
    const teachers = await getPublicTeachers({ isStaff, programSlug });
    apiSuccess(res, teachers, 'Data guru & tenaga kependidikan berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_TEACHERS_FAILED', null, 500);
  }
});

// 9. Facilities / Fasilitas
publicRouter.get('/facilities', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const facilities = await getPublicFacilities(category);
    apiSuccess(res, facilities, 'Data sarana & fasilitas berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_FACILITIES_FAILED', null, 500);
  }
});

// 10. Galleries / Galeri
publicRouter.get('/galleries', async (_req: Request, res: Response) => {
  try {
    const galleries = await getPublicGalleries();
    apiSuccess(res, galleries, 'Galeri foto kegiatan berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_GALLERIES_FAILED', null, 500);
  }
});

publicRouter.get('/galleries/:slug', async (req: Request, res: Response) => {
  try {
    const gallery = await getPublicGalleryBySlug(req.params.slug);
    if (!gallery) {
      apiError(res, 'Album galeri tidak ditemukan.', 'NOT_FOUND', null, 404);
      return;
    }
    apiSuccess(res, gallery, 'Detail album galeri berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_GALLERY_DETAIL_FAILED', null, 500);
  }
});

// 11. Contact Form Submission
publicRouter.post(
  '/contact',
  contactLimiter,
  validate(ContactMessageSchema),
  async (req: Request, res: Response) => {
    try {
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const message = await submitContactMessage(req.body, ipAddress);
      apiSuccess(res, { id: message.id }, 'Pesan Anda telah berhasil terkirim. Terima kasih atas masukan Anda.');
    } catch (error: any) {
      apiError(res, error.message || 'Gagal mengirim pesan.', 'CONTACT_SUBMIT_FAILED', null, 500);
    }
  }
);

// 12. PPDB Online
publicRouter.get('/ppdb', async (_req: Request, res: Response) => {
  try {
    const data = await getPublicPpdbInfo();
    apiSuccess(res, data, 'Informasi PPDB berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_PPDB_FAILED', null, 500);
  }
});

publicRouter.post('/ppdb/consult', contactLimiter, async (req: Request, res: Response) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const { name, juniorSchool, phone, email, programChoice1, programChoice2, questions } = req.body;
    if (!name || !juniorSchool || !phone || !programChoice1) {
      apiError(res, 'Nama, Asal Sekolah, No. WhatsApp, dan Pilihan Jurusan wajib diisi.', 'INVALID_INPUT', null, 400);
      return;
    }
    const result = await submitPpdbConsultation({
      name,
      juniorSchool,
      phone,
      email,
      programChoice1,
      programChoice2,
      questions,
      ipAddress,
    });
    apiSuccess(res, { id: result.id }, 'Konsultasi pra-pendaftaran PPDB berhasil dikirim. Panitia akan segera menghubungi Anda.');
  } catch (error: any) {
    apiError(res, error.message, 'SUBMIT_PPDB_FAILED', null, 500);
  }
});

// 13. BKK & Mitra Industri
publicRouter.get('/bkk', async (_req: Request, res: Response) => {
  try {
    const data = await getPublicBkkInfo();
    apiSuccess(res, data, 'Informasi BKK dan Mitra Industri berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_BKK_FAILED', null, 500);
  }
});

publicRouter.post('/bkk/tracer', contactLimiter, async (req: Request, res: Response) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const { fullName, graduationYear, programMajor, currentStatus, institutionName, jobTitleOrField, phone, email, notes } = req.body;
    if (!fullName || !graduationYear || !programMajor || !currentStatus || !phone) {
      apiError(res, 'Nama, Tahun Lulus, Jurusan, Status, dan Nomor HP/WA wajib diisi.', 'INVALID_INPUT', null, 400);
      return;
    }
    const result = await submitTracerStudy({
      fullName,
      graduationYear: Number(graduationYear),
      programMajor,
      currentStatus,
      institutionName,
      jobTitleOrField,
      phone,
      email,
      notes,
      ipAddress,
    });
    apiSuccess(res, { id: result.id }, 'Terima kasih! Data tracer study alumni berhasil tersimpan.');
  } catch (error: any) {
    apiError(res, error.message, 'SUBMIT_TRACER_FAILED', null, 500);
  }
});

// 14. Pusat Unduhan Dokumen
publicRouter.get('/downloads', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const data = await getPublicDownloads(category, search);
    apiSuccess(res, data, 'Daftar dokumen unduhan publik berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'LOAD_DOWNLOADS_FAILED', null, 500);
  }
});

// 15. Pencarian Global Terpadu (Unified Command Palette Search)
publicRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const results = await searchPublic(query);
    apiSuccess(res, results, 'Hasil pencarian global berhasil dimuat.');
  } catch (error: any) {
    apiError(res, error.message, 'SEARCH_FAILED', null, 500);
  }
});

