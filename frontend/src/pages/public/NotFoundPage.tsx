import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-forest-100 text-forest-800 flex items-center justify-center shadow-inner">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>
        <h1 className="editorial-title text-4xl sm:text-5xl font-bold text-forest-900">
          404
        </h1>
        <h2 className="text-lg font-bold text-gray-800">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed font-light">
          Halaman yang Anda tuju mungkin telah dipindahkan, diganti nama, atau tautan yang Anda masukkan kurang tepat.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
