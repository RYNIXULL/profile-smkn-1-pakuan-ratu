export type RoleName = 'SUPER_ADMIN' | 'ADMIN_HUMAS' | 'OPERATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleDisplayName?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  permissions?: string[];
  lastLoginAt?: string | null;
}

export type NewsStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { news: number };
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl?: string | null;
  status: NewsStatus;
  publishedAt?: string | null;
  isFeatured: boolean;
  viewsCount: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string };
  author: { id: string; name: string; avatarUrl?: string | null };
}

export interface ProgramItem {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  shortDesc: string;
  fullDesc?: string;
  competencies?: string;
  careerProspects?: string;
  facilities?: string;
  accentColor?: string | null;
  iconName?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
  teachers?: TeacherItem[];
}

export interface TeacherItem {
  id: string;
  name: string;
  nip?: string | null;
  position: string;
  subject?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  isStaff: boolean;
  orderIndex: number;
  programId?: string | null;
  program?: { id: string; name: string; slug: string } | null;
}

export interface FacilityItem {
  id: string;
  name: string;
  category: string;
  description: string;
  location?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  studentName: string;
  competition: string;
  level: string;
  category: string;
  year: number;
  description?: string | null;
  photoUrl?: string | null;
  isFeatured: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  imageUrl?: string | null;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  attachment?: string | null;
  isUrgent: boolean;
  isActive: boolean;
  publishedAt: string;
  expiresAt?: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category: string;
  coverUrl?: string | null;
  createdAt: string;
  items?: Array<{
    id: string;
    caption?: string | null;
    orderIndex: number;
    media: MediaItem;
  }>;
  _count?: { items: number };
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  caption?: string | null;
  createdAt: string;
  uploader?: { id: string; name: string } | null;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  updatedAt: string;
}

export interface HomepageSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  isVisible: boolean;
  orderIndex: number;
}

export interface AuditLogItem {
  id: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
