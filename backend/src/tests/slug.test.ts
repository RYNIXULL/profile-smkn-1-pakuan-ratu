import { describe, it, expect } from 'vitest';
import { slugify } from '../utils/slug';

describe('Slug Utility', () => {
  it('harus mengonversi teks menjadi slug URL bersih', () => {
    const input = 'Panen Raya Hortikultura Modern & Melon Emas di SMKN 1';
    const output = slugify(input);
    expect(output).toBe('panen-raya-hortikultura-modern-dan-melon-emas-di-smkn-1');
  });

  it('harus menghapus karakter khusus dan tanda baca', () => {
    const input = 'Juara 1 Lomba Desain! (Tingkat Provinsi #2026)';
    const output = slugify(input);
    expect(output).toBe('juara-1-lomba-desain-tingkat-provinsi-2026');
  });

  it('harus menangani spasi ganda dan tanda hubung berulang', () => {
    const input = '  Teknik   dan   Bisnis   Sepeda  Motor -- TBSM  ';
    const output = slugify(input);
    expect(output).toBe('teknik-dan-bisnis-sepeda-motor-tbsm');
  });
});
