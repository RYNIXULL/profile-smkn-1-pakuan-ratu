import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ProgramItem } from '../../types';
import {
  Sprout,
  Beef,
  TrendingUp,
  Palette,
  Wrench,
  CheckCircle2,
  Briefcase,
  Building2,
  Users,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { SeoHelmet } from '../../components/ui/SeoHelmet';
import { Skeleton, SkeletonPageHeader } from '../../components/ui/Skeleton';

const programIcons: Record<string, React.ReactNode> = {
  pertanian: <Sprout className="w-8 h-8 text-emerald-600" />,
  peternakan: <Beef className="w-8 h-8 text-amber-600" />,
  'akuntansi-bisnis-digital': <TrendingUp className="w-8 h-8 text-blue-600" />,
  dkv: <Palette className="w-8 h-8 text-purple-600" />,
  tbsm: <Wrench className="w-8 h-8 text-rose-600" />,
};

const programImages: Record<string, string> = {
  pertanian: '/images/pertanian.jpg',
  peternakan: '/images/peternakan.jpg',
  'akuntansi-bisnis-digital': '/images/akuntansi.jpg',
  dkv: '/images/dkv.jpg',
  tbsm: '/images/tbsm.jpg',
};

export const ProgramDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: program, isLoading, isError } = useQuery<ProgramItem>({
    queryKey: ['publicProgramDetail', slug],
    queryFn: () => api.get(`/public/programs/${slug}`),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <SkeletonPageHeader />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !program) {
    return <Navigate to="/program-keahlian" replace />;
  }

  // Parse JSON competencies, prospects, and facilities
  let competencies: string[] = [];
  let prospects: string[] = [];
  let facilities: string[] = [];

  try {
    if (program.competencies) competencies = JSON.parse(program.competencies);
  } catch {
    competencies = [program.competencies || ''];
  }

  try {
    if (program.careerProspects) prospects = JSON.parse(program.careerProspects);
  } catch {
    prospects = [program.careerProspects || ''];
  }

  try {
    if (program.facilities) facilities = JSON.parse(program.facilities);
  } catch {
    facilities = [program.facilities || ''];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SeoHelmet
        title={`Jurusan ${program.name}`}
        description={program.shortDesc || program.tagline || `Program keahlian vokasi unggulan ${program.name} di SMKN 1 Pakuan Ratu.`}
        image={program.imageUrl || programImages[program.slug]}
        url={`/program-keahlian/${program.slug}`}
      />

      {/* Back button */}
      <div>
        <Link
          to="/program-keahlian"
          className="inline-flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-forest-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Program Keahlian</span>
        </Link>
      </div>

      {/* Hero Detail Card */}
      <div className="relative rounded-3xl overflow-hidden bg-forest-900 text-white p-8 sm:p-14 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src={program.imageUrl || programImages[program.slug] || '/images/campus.jpg'}
            alt={program.name}
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/90 to-forest-900/60" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-white/90 shadow-md">
            {programIcons[program.slug] || <Sprout className="w-6 h-6 text-forest-800" />}
          </div>
          <h1 className="editorial-title text-3xl sm:text-5xl font-bold tracking-tight">
            {program.name}
          </h1>
          {program.tagline && (
            <p className="text-sm sm:text-base text-emerald-300 font-medium leading-relaxed">
              {program.tagline}
            </p>
          )}
          <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed font-light">
            {program.fullDesc || program.shortDesc}
          </p>
        </div>
      </div>

      {/* Grid: Kompetensi & Prospek Karir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kompetensi yang Dipelajari */}
        <div className="glass-card p-8 rounded-3xl border border-forest-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Kompetensi Keahlian
            </h2>
          </div>
          <ul className="space-y-3">
            {competencies.map((comp, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                <span>{comp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prospek Karir & Dunia Kerja */}
        <div className="glass-card p-8 rounded-3xl border border-forest-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Peluang Karir & Industri
            </h2>
          </div>
          <ul className="space-y-3">
            {prospects.map((prosp, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <span>{prosp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sarana & Fasilitas Praktik Jurusan */}
      <div className="glass-card p-8 rounded-3xl border border-forest-100 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-serif">
            Fasilitas & Ruang Praktik Kejuruan
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-forest-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-800 leading-snug">{fac}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guru & Instruktur Jurusan */}
      {program.teachers && program.teachers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Tim Guru & Instruktur Produktif
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {program.teachers.map((tch) => (
              <div
                key={tch.id}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-forest-100 overflow-hidden flex-shrink-0">
                  <img
                    src={
                      tch.photoUrl ||
                      '/images/kepsek.jpg'
                    }
                    alt={tch.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">
                    {tch.name}
                  </h4>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    {tch.position}
                  </p>
                  {tch.subject && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      {tch.subject}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Konsultasi Kejuruan */}
      <div className="p-8 sm:p-10 rounded-3xl bg-forest-50 border border-forest-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-forest-900 font-serif">
            Tertarik Mendaftar di Jurusan Ini?
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Dapatkan informasi lengkap mengenai syarat pendaftaran dan beasiswa di SMKN 1 Pakuan Ratu.
          </p>
        </div>
        <Link
          to="/kontak"
          className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs transition-colors flex-shrink-0"
        >
          Hubungi Layanan Konsultasi
        </Link>
      </div>
    </div>
  );
};
