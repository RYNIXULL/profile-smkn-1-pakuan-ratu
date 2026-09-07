import { describe, it, expect } from 'vitest';
import { LoginSchema, NewsCreateSchema, ContactMessageSchema } from '../validators';

describe('Zod Input Validation', () => {
  it('harus memvalidasi data login yang benar', () => {
    const valid = LoginSchema.safeParse({
      email: 'admin@smkn1pakuanratu.sch.id',
      password: 'SecurePassword123!',
    });
    expect(valid.success).toBe(true);
  });

  it('harus menolak format email yang salah pada login', () => {
    const invalid = LoginSchema.safeParse({
      email: 'bukan-email-valid',
      password: '123',
    });
    expect(invalid.success).toBe(false);
  });

  it('harus memvalidasi berita baru dengan benar', () => {
    const validNews = NewsCreateSchema.safeParse({
      title: 'Panen Raya Hortikultura di SMKN 1 Pakuan Ratu',
      categoryId: 'cat-uuid-1',
      summary: 'Ringkasan berita mengenai panen melon emas hidroponik.',
      content: '<p>Konten lengkap mengenai keberhasilan panen tanaman pangan dan hortikultura di greenhouse sekolah.</p>',
      status: 'PUBLISHED',
    });
    expect(validNews.success).toBe(true);
  });

  it('harus memvalidasi berita baru dengan path gambar lokal (/uploads/...)', () => {
    const validLocalImage = NewsCreateSchema.safeParse({
      title: 'Panen Raya Hortikultura di SMKN 1 Pakuan Ratu',
      categoryId: 'cat-uuid-1',
      summary: 'Ringkasan berita mengenai panen melon emas hidroponik.',
      content: '<p>Konten lengkap mengenai keberhasilan panen tanaman pangan.</p>',
      thumbnailUrl: '/uploads/media-panen-raya-2026.webp',
      status: 'PUBLISHED',
    });
    expect(validLocalImage.success).toBe(true);
  });

  it('harus memvalidasi berita baru dengan URL web eksternal', () => {
    const validWebImage = NewsCreateSchema.safeParse({
      title: 'Kunjungan Industri Siswa TBSM ke Bengkel Resmi',
      categoryId: 'cat-uuid-2',
      summary: 'Ringkasan kegiatan kunjungan industri.',
      content: '<p>Konten kegiatan magang dan observasi bengkel.</p>',
      thumbnailUrl: 'https://images.unsplash.com/photo-12345',
      status: 'DRAFT',
    });
    expect(validWebImage.success).toBe(true);
  });

  it('harus menolak input form kontak jika pesan terlalu singkat', () => {
    const invalid = ContactMessageSchema.safeParse({
      name: 'Budi',
      email: 'budi@example.com',
      subject: 'Tanya',
      message: 'Halo', // kurang dari 10 karakter
    });
    expect(invalid.success).toBe(false);
  });
});
