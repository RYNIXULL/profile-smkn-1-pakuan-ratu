import { describe, it, expect } from 'vitest';
import { sanitizeHtmlContent } from '../middleware/sanitize';

describe('HTML Sanitization (Anti-XSS)', () => {
  it('harus menghapus tag <script> dan payload berbahaya', () => {
    const dirty = '<p>Halo Dunia</p><script>alert("hacked")</script>';
    const clean = sanitizeHtmlContent(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('alert("hacked")');
    expect(clean).toContain('<p>Halo Dunia</p>');
  });

  it('harus menghapus event handler berbahaya seperti onerror dan onload', () => {
    const dirty = '<img src="/uploads/foto.webp" onerror="alert(1)" alt="Foto">';
    const clean = sanitizeHtmlContent(dirty);
    expect(clean).not.toContain('onerror');
    expect(clean).toContain('src="/uploads/foto.webp"');
  });

  it('harus menolak skema link javascript: dan data:', () => {
    const dirty = '<a href="javascript:stealCookie()">Klik Di Sini</a><a href="data:text/html;base64,PHNjcmlwdD4=">Link Data</a>';
    const clean = sanitizeHtmlContent(dirty);
    expect(clean).not.toContain('javascript:');
    expect(clean).not.toContain('data:');
  });

  it('harus mempertahankan tag HTML format yang aman', () => {
    const safe = '<h3>Visi SMKN 1 Pakuan Ratu</h3><p>Mencetak lulusan <strong>kompeten</strong> dan <em>berakhlak mulia</em>.</p>';
    const clean = sanitizeHtmlContent(safe);
    expect(clean).toBe(safe);
  });
});
