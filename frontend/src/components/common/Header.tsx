import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignInAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/developers', label: 'Talentos' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/login', label: 'Iniciar Sesión' },
  { to: '/register', label: 'Registrarse' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = false;
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-sky-500 bg-sky-300/80 backdrop-blur-md px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        
        {/* Logo como TEXTO clickeable */}
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-emerald-950 hover:text-emerald-800 transition-colors"
        >
          CodeCraft
        </button>

        {/* Menú con botones suaves (sin fondo, solo texto con hover) */}
        <nav
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
          className="flex-1"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium text-emerald-950 bg-white/40 rounded-lg hover:bg-white/70 hover:text-emerald-800 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acciones de usuario */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" className="text-emerald-950">
              <FaUser className="mr-2 h-4 w-4" /> Mi Perfil
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-emerald-950 bg-white/40 hover:bg-white/70">
                  <FaSignInAlt className="mr-2 h-4 w-4" /> Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-emerald-700 text-white hover:bg-emerald-600">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa (solo móvil) */}
        <button
          className="block text-emerald-950 md:hidden"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 border-t border-sky-500 pt-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium text-emerald-950 bg-white/40 rounded-lg hover:bg-white/70"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-sky-500" />
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-emerald-950 bg-white/40">
              <FaSignInAlt className="mr-2 h-4 w-4" /> Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register" onClick={() => setIsMenuOpen(false)}>
            <Button size="sm" className="w-full bg-emerald-700 text-white">
              Registrarse
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};