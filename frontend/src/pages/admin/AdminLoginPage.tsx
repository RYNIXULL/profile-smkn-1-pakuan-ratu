import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../stores/authStore';
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '../../stores/toastStore';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Silakan masukkan email dan password akun Anda.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-forest-900/10 rounded-full blur-3xl" />

      {/* Back to Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Publik</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold text-2xl font-serif shadow-lg">
            1
          </div>
          <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-gray-900">
            Login CMS Pengelola
          </h2>
          <p className="text-xs text-gray-500">
            Sistem Informasi & Manajemen Konten SMKN 1 Pakuan Ratu
          </p>
        </div>

        {/* Form Container with Frosted Glass styling */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-white/60 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Akun *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@smkn1pakuanratu.sch.id"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 shadow-xs"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password Akun *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 shadow-xs"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Akses...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Masuk ke Panel Kontrol</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400">
                Sistem dilengkapi enkripsi sesi, proteksi brute-force, dan audit logging otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
