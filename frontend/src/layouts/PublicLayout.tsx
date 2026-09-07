import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/ui/Toast';
import { GlobalSearchModal } from '../components/ui/GlobalSearchModal';
import { WhatsAppFloatingButton } from '../components/ui/WhatsAppFloatingButton';
import { PwaInstallPrompt } from '../components/ui/PwaInstallPrompt';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream-50 text-gray-800">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <GlobalSearchModal />
      <WhatsAppFloatingButton />
      <PwaInstallPrompt />
      <ToastContainer />
    </div>
  );
};

