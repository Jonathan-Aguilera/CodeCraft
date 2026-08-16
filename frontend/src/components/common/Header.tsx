// components/common/Header.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignInAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Navbar } from './Navbar';

// Definimos los enlaces principales (todos visibles por ahora)
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
  // Mock de autenticación (después lo reemplazaremos con el contexto real)
  const isAuthenticated = false;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="border-b border-gray-800 bg-[#1E1E1E] px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-500">
          <span>CodeCraft</span>
        </Link>

        {/* Navbar (Desktop) */}
        <Navbar links={NAV_LINKS} className="hidden md:flex" />

        {/* Acciones (Desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="text-gray-300">
                <FaUser className="mr-2 h-4 w-4" />
                Mi Perfil
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-gray-300">
                  <FaSignInAlt className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Botón Hamburguesa (Móvil) */}
        <button
          className="block text-gray-300 transition-colors hover:text-emerald-400 md:hidden"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Menú Móvil */}
      {isMenuOpen && (
        <div className="mt-4 flex flex-col gap-4 border-t border-gray-700 pt-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-300 transition-colors hover:text-emerald-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-700" />
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
              <FaUser className="mr-2 h-4 w-4" />
              Mi Perfil
            </Button>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
                  <FaSignInAlt className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};