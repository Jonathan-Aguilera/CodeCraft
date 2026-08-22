// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};