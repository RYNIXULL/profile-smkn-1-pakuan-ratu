import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { NewsItem } from '../../types';
import { ArrowLeft, Eye, Share2, ChevronRight, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { toast } from '../../stores/toastStore';
import { SeoHelmet } from '../../components/ui/SeoHelmet';
import { Skeleton, SkeletonPageHeader } from '../../components/ui/Skeleton';
import DOMPurify from 'dompurify';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery<{
    item: NewsItem;
    related: NewsItem[];
  }>({
    queryKey: ['publicNewsDetail', slug],
    queryFn: () => api.get(`/public/news/${slug}`),
    enabled: !!slug,
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan artikel berhasil disalin ke papan klip!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <SkeletonPageHeader />
        <Skeleton className="h-96 w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-5/6 rounded-md" />
          <Skeleton className="h-5 w-4/6 rounded-md" />
        </div>
      </div>
    );
  }

  if (isError || !data?.item) {
    return <Navigate to="/berita" replace />;
  }

  const { item, related } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SeoHelmet
        title={item.title}
        description={item.summary || item.metaDesc || item.title}
        image={item.thumbnailUrl}
        url={`/berita/${item.slug}`}
        type="article"
        publishedTime={item.publishedAt}
        author={item.author?.name}
        category={item.category?.name}
      />

      {/* Back Link */}
      <div>
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-forest-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Seluruh Berita</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
            {item.category?.name || 'Vokasi'}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">{formatDate(item.publishedAt)}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>{item.viewsCount} pembaca</span>
          </span>
        </div>

        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-950 leading-tight">
          {item.title}
        </h1>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
              {item.author?.name ? item.author.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {item.author?.name || 'Humas SMKN 1 Pakuan Ratu'}
              </p>
              <p className="text-[10px] text-gray-500">Tim Publikasi Sekolah</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-forest-50 text-xs font-semibold text-gray-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-forest-700" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Featured Thumbnail */}
      {item.thumbnailUrl && (
        <div className="rounded-3xl overflow-hidden shadow-md bg-forest-900 aspect-video max-h-[480px]">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="glass-card p-6 sm:p-12 rounded-3xl border border-forest-100">
        <div
          className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-forest-950 prose-a:text-emerald-700 prose-img:rounded-2xl text-sm sm:text-base leading-relaxed text-gray-700 space-y-4"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }}
        />
      </article>

      {/* Related Articles */}
      {related && related.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-200/80">
          <h3 className="text-xl font-bold text-forest-900 font-serif">
            Berita Terkait Lainnya
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/berita/${rel.slug}`}
                className="group p-4 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-400 block">
                    {formatDate(rel.publishedAt)}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-forest-700 transition-colors leading-snug line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 mt-3 flex items-center gap-1">
                  Baca <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
