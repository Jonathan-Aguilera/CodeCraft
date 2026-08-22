import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { HomePage } from '@/pages/HomePage';
import { DevelopersPage } from '@/pages/DevelopersPage';
import { DeveloperProfilePage } from '@/pages/DeveloperProfilePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con layout principal (con Navbar y Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="developers" element={<DevelopersPage />} />
          <Route path="developers/:uid" element={<DeveloperProfilePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="projects/new" element={<CreateProjectPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Rutas de autenticación (sin Navbar, con Footer) */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;