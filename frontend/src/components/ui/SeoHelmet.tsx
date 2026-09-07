import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SeoHelmetProps {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  author?: string | null;
  category?: string | null;
  keywords?: string[];
}

const DEFAULT_TITLE = 'SMKN 1 Pakuan Ratu - Berakar pada Potensi, Tumbuh Menuju Masa Depan';
const DEFAULT_DESC =
  'Website Resmi SMK Negeri 1 Pakuan Ratu, Kabupaten Way Kanan, Lampung. Pusat keunggulan pendidikan vokasi Pertanian, Peternakan, Akuntansi & Bisnis Digital, DKV, dan TBSM.';
const DEFAULT_IMAGE = '/images/hero_school.jpg';
const SITE_NAME = 'SMKN 1 Pakuan Ratu';

export const SeoHelmet: React.FC<SeoHelmetProps> = ({
  title,
  description = DEFAULT_DESC,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  category,
  keywords = [
    'SMKN 1 Pakuan Ratu',
    'SMK Way Kanan',
    'SMK Pusat Keunggulan',
    'PPDB SMKN 1 Pakuan Ratu',
    'Vokasi Lampung',
    'Pertanian',
    'DKV',
    'TBSM',
  ],
}) => {
  const fullTitle = title ? `${title} | SMKN 1 Pakuan Ratu` : DEFAULT_TITLE;

  // Resolving absolute URLs for OpenGraph crawlers (WhatsApp, Facebook, Twitter)
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://smkn1pakuanratu.sch.id';

  const rawImage = image || DEFAULT_IMAGE;
  const fullImage = rawImage.startsWith('http')
    ? rawImage
    : `${origin}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  const currentUrl = url
    ? (url.startsWith('http') ? url : `${origin}${url.startsWith('/') ? '' : '/'}${url}`)
    : (typeof window !== 'undefined' ? window.location.href : origin);

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content="id_ID" />

      {/* Article Specific Metadata */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && category && (
        <meta property="article:section" content={category} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@smkn1pakuanratu" />
      <meta name="twitter:creator" content="@smkn1pakuanratu" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title || SITE_NAME} />
    </Helmet>
  );
};
