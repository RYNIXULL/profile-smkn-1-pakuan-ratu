import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, Link as LinkIcon, Loader2, Check } from 'lucide-react';
import { toast } from '../../stores/toastStore';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  required?: boolean;
  className?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Unggah Gambar',
  helperText = 'Pilih berkas dari komputer (JPEG, PNG, WebP maks. 5MB). Otomatis dikompresi ke WebP.',
  aspectRatio = 'video',
  required = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Aspect ratio styling classes
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square max-w-[220px]',
    wide: 'aspect-[21/9]',
    auto: 'min-h-[160px] max-h-[300px]',
  }[aspectRatio];

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('files', file);
      return api.upload('/admin/media/upload', formData);
    },
    onSuccess: (res: any) => {
      if (res && res.length > 0) {
        const uploadedUrl = res[0].url;
        onChange(uploadedUrl);
        queryClient.invalidateQueries({ queryKey: ['adminMediaList'] });
        toast.success('Gambar lokal berhasil diunggah dan dioptimasi ke format WebP.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal mengunggah gambar lokal.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
  });

  const handleFile = (file: File) => {
    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format berkas tidak didukung. Harap pilih gambar JPEG, PNG, atau WebP.');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar melebihi batas 5MB.');
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyManualUrl = () => {
    if (!manualUrlInput.trim()) {
      toast.error('Silakan masukkan URL gambar.');
      return;
    }
    onChange(manualUrlInput.trim());
    setShowManualUrl(false);
    setManualUrlInput('');
    toast.success('URL gambar berhasil diterapkan.');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => {
            setShowManualUrl(!showManualUrl);
            setManualUrlInput('');
          }}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualUrl ? 'Mode Unggah Berkas' : 'Input URL Manual'}</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Manual URL Input Mode */}
      {showManualUrl ? (
        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-gray-200 space-y-3 shadow-xs">
          <div className="flex gap-2">
            <input
              type="text"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder="https://... atau /uploads/..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
            />
            <button
              type="button"
              onClick={handleApplyManualUrl}
              className="px-3 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Terapkan</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500">
            Tempelkan URL langsung jika menggunakan gambar eksternal yang sudah tersedia online.
          </p>
        </div>
      ) : (
        /* Upload Mode / Preview Mode */
        <div>
          {value ? (
            /* Preview State with Controls */
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-50 group shadow-xs">
              <div className={`w-full ${aspectClasses} overflow-hidden flex items-center justify-center bg-slate-900/5`}>
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback visual if broken image
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Uploading Overlay during Replace */}
              {uploadMutation.isPending && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                  <Loader2 className="w-7 h-7 text-forest-700 animate-spin" />
                  <p className="text-xs font-semibold text-gray-700">Mengoptimasi & mengunggah gambar...</p>
                </div>
              )}

              {/* Action Controls Bar */}
              <div className="p-3 bg-white/95 backdrop-blur-md border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <ImageIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-[11px] font-mono text-gray-600 truncate" title={value}>
                    {value.startsWith('/uploads/') ? value.replace('/uploads/', '') : value}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium transition-colors"
                    title="Ganti dengan gambar lokal lain"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ganti Gambar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    disabled={uploadMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors"
                    title="Hapus gambar ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State: Dropzone to Upload Local File */
            <div
              onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                  : 'border-gray-200 hover:border-emerald-500/70 bg-white/60 hover:bg-emerald-50/30'
              }`}
            >
              {uploadMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <Loader2 className="w-8 h-8 text-forest-700 animate-spin" />
                  <p className="text-xs font-semibold text-gray-800">
                    Sedang mengunggah dan mengompresi gambar ke WebP...
                  </p>
                  <p className="text-[11px] text-gray-500">Mohon tunggu beberapa saat</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Klik untuk pilih gambar dari komputer{' '}
                      <span className="font-normal text-gray-500">atau seret ke sini</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
