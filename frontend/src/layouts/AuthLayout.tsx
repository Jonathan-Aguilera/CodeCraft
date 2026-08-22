import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/common/Footer';

export const AuthLayout = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #B0E0E6 0%, #E0F7FA 50%, #ffffff 100%)',
        minHeight: '100vh',
      }}
      className="flex min-h-screen flex-col"
    >
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};