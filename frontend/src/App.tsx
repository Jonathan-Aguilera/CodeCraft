import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
// Importaremos más páginas después (Login, Register, etc.)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal con layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* Aquí irán más rutas: /developers, /projects, /login, etc. */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;