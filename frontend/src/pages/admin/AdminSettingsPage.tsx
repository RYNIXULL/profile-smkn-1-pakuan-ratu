import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Save, Settings, Loader2 } from 'lucide-react';
import { toast } from '../../stores/toastStore';

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [schoolName, setSchoolName] = useState('');
  const [schoolTagline, setSchoolTagline] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolHours, setSchoolHours] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');

  const { data: settingsList, isLoading } = useQuery<Array<{ key: string; value: string }>>({
    queryKey: ['adminSettingsList'],
    queryFn: () => api.get('/admin/settings'),
  });

  useEffect(() => {
    if (settingsList) {
      const getVal = (k: string) => settingsList.find((s) => s.key === k)?.value || '';
      setSchoolName(getVal('school_name'));
      setSchoolTagline(getVal('school_tagline'));
      setSchoolAddress(getVal('school_address'));
      setSchoolPhone(getVal('school_phone'));
      setSchoolEmail(getVal('school_email'));
      setSchoolHours(getVal('school_hours'));
      setSocialInstagram(getVal('social_instagram'));
      setSocialYoutube(getVal('social_youtube'));
      setSocialFacebook(getVal('social_facebook'));
    }
  }, [settingsList]);

  const saveMutation = useMutation({
    mutationFn: (payload: any) => api.put('/admin/settings', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettingsList'] });
      queryClient.invalidateQueries({ queryKey: ['publicSettings'] });
      toast.success('Pengaturan sekolah berhasil diperbarui.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan pengaturan.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      settings: [
        { key: 'school_name', value: schoolName },
        { key: 'school_tagline', value: schoolTagline },
        { key: 'school_address', value: schoolAddress },
        { key: 'school_phone', value: schoolPhone },
        { key: 'school_email', value: schoolEmail },
        { key: 'school_hours', value: schoolHours },
        { key: 'social_instagram', value: socialInstagram },
        { key: 'social_youtube', value: socialYoutube },
        { key: 'social_facebook', value: socialFacebook },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest-800">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
        <p className="text-xs font-medium text-gray-500 mt-3">Memuat pengaturan sistem...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Pengaturan Umum Sekolah</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Kelola informasi nama resmi, kontak, dan tautan sosial media sekolah.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-gray-900">Data Kontak & Identitas</h3>
          </div>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Resmi Sekolah *</label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Slogan / Motto Sekolah</label>
            <input
              type="text"
              value={schoolTagline}
              onChange={(e) => setSchoolTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Kampus Lengkap</label>
          <textarea
            rows={2}
            value={schoolAddress}
            onChange={(e) => setSchoolAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor Telepon</label>
            <input
              type="text"
              value={schoolPhone}
              onChange={(e) => setSchoolPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Resmi</label>
            <input
              type="email"
              value={schoolEmail}
              onChange={(e) => setSchoolEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Jam Operasional Pelayanan</label>
            <input
              type="text"
              value={schoolHours}
              onChange={(e) => setSchoolHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-4">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Tautan Media Sosial</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
