import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProfilPage } from './pages/public/ProfilPage';
import { ProgramsPage } from './pages/public/ProgramsPage';
import { ProgramDetailPage } from './pages/public/ProgramDetailPage';
import { NewsPage } from './pages/public/NewsPage';
import { NewsDetailPage } from './pages/public/NewsDetailPage';
import { EventsPage } from './pages/public/EventsPage';
import { AnnouncementsPage } from './pages/public/AnnouncementsPage';
import { AchievementsPage } from './pages/public/AchievementsPage';
import { TeachersPage } from './pages/public/TeachersPage';
import { FacilitiesPage } from './pages/public/FacilitiesPage';
import { GalleriesPage } from './pages/public/GalleriesPage';
import { GalleryDetailPage } from './pages/public/GalleryDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminNewsListPage } from './pages/admin/AdminNewsListPage';
import { AdminNewsEditorPage } from './pages/admin/AdminNewsEditorPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminAchievementsPage } from './pages/admin/AdminAchievementsPage';
import { AdminProgramsPage } from './pages/admin/AdminProgramsPage';
import { AdminTeachersPage } from './pages/admin/AdminTeachersPage';
import { AdminFacilitiesPage } from './pages/admin/AdminFacilitiesPage';
import { AdminGalleriesPage } from './pages/admin/AdminGalleriesPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminPagesEditorPage } from './pages/admin/AdminPagesEditorPage';
import { AdminHomepageEditorPage } from './pages/admin/AdminHomepageEditorPage';
import { AdminContactsPage } from './pages/admin/AdminContactsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* ------------------------------------------------------------- */}
      {/* PUBLIC WEBSITE ROUTES */}
      {/* ------------------------------------------------------------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Profil Sub-routes */}
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/profil/:slug" element={<ProfilPage />} />

        {/* Program Keahlian */}
        <Route path="/program-keahlian" element={<ProgramsPage />} />
        <Route path="/program-keahlian/:slug" element={<ProgramDetailPage />} />

        {/* Warta & Berita */}
        <Route path="/berita" element={<NewsPage />} />
        <Route path="/berita/:slug" element={<NewsDetailPage />} />

        {/* Agenda & Pengumuman */}
        <Route path="/agenda" element={<EventsPage />} />
        <Route path="/pengumuman" element={<AnnouncementsPage />} />

        {/* Prestasi */}
        <Route path="/prestasi" element={<AchievementsPage />} />

        {/* Guru & Fasilitas */}
        <Route path="/guru" element={<TeachersPage />} />
        <Route path="/fasilitas" element={<FacilitiesPage />} />

        {/* Galeri */}
        <Route path="/galeri" element={<GalleriesPage />} />
        <Route path="/galeri/:slug" element={<GalleryDetailPage />} />

        {/* Kontak */}
        <Route path="/kontak" element={<ContactPage />} />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ------------------------------------------------------------- */}
      {/* ADMIN CMS ROUTES */}
      {/* ------------------------------------------------------------- */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="news" element={<AdminNewsListPage />} />
        <Route path="news/create" element={<AdminNewsEditorPage />} />
        <Route path="news/:id/edit" element={<AdminNewsEditorPage />} />
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="achievements" element={<AdminAchievementsPage />} />
        <Route path="programs" element={<AdminProgramsPage />} />
        <Route path="teachers" element={<AdminTeachersPage />} />
        <Route path="facilities" element={<AdminFacilitiesPage />} />
        <Route path="galleries" element={<AdminGalleriesPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="pages" element={<AdminPagesEditorPage />} />
        <Route path="homepage" element={<AdminHomepageEditorPage />} />
        <Route path="contacts" element={<AdminContactsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};
