import React, { useState } from 'react';
import { api } from '../../lib/api';
import { toast } from '../../stores/toastStore';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Instagram,
  Youtube,
  Facebook,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Mohon lengkapi seluruh kolom yang wajib diisi.');
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error('Pesan minimal 10 karakter.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/public/contact', formData);
      setIsSubmitted(true);
      toast.success('Pesan Anda telah berhasil dikirim ke pihak sekolah!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider inline-block">
          Hubungi Kami
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Kontak & Informasi Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Kami siap melayani pertanyaan seputar penerimaan peserta didik baru (PPDB), kemitraan magang industri (DUDI), dan informasi akademik lainnya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-forest-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Sekretariat & Pelayanan
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-forest-100 text-forest-800 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Alamat Kampus:</p>
                  <p className="text-gray-600 leading-relaxed mt-0.5">
                    Jl. Raya Pakuan Ratu, Kec. Pakuan Ratu, Kab. Way Kanan, Lampung 34762
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Telepon Resmi:</p>
                  <p className="text-gray-600 mt-0.5">(0723) 567890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Surel (Email):</p>
                  <p className="text-gray-600 mt-0.5">info@smkn1pakuanratu.sch.id</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Jam Layanan Kantor:</p>
                  <p className="text-gray-600 mt-0.5">Senin - Jumat: 07.15 - 15.45 WIB</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-800 mb-3">Media Sosial Resmi:</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8 sm:p-12 rounded-3xl border border-forest-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 font-serif mb-2">
              Kirim Pesan atau Pertanyaan
            </h2>
            <p className="text-xs text-gray-600 mb-8 font-light">
              Silakan isi formulir berikut. Tim humas sekolah akan menindaklanjuti pesan Anda dalam waktu 1x24 jam kerja.
            </p>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">
                  Pesan Anda Telah Diterima
                </h3>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Terima kasih telah menghubungi SMKN 1 Pakuan Ratu. Staf kami akan merespons melalui email yang Anda cantumkan.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Pratama"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nomor Telepon / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Subjek Pesan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Contoh: Informasi Pendaftaran PPDB"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Isi Pesan * (Minimal 10 karakter)
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pertanyaan atau informasi yang Anda butuhkan secara detail..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Pesan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
