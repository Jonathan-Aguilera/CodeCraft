import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-[#1A1A1A] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Columna 1: Logo y descripción */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-emerald-500">CodeCraft</h3>
            <p className="mt-2 text-sm text-gray-400">
              Conectamos talento tecnológico con oportunidades.
            </p>
          </div>

          {/* Columna 2: Producto */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300">Producto</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              <li><Link to="/developers" className="hover:text-emerald-400">Talentos</Link></li>
              <li><Link to="/projects" className="hover:text-emerald-400">Proyectos</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400">Sobre Nosotros</Link></li>
            </ul>
          </div>

          {/* Columna 3: Compañía */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300">Compañía</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-emerald-400">Quiénes somos</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400">Términos</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400">Privacidad</Link></li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300">Síguenos</h4>
            <div className="mt-2 flex space-x-3">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-emerald-400"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-emerald-400"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-emerald-400"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-emerald-400"
                aria-label="Email"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              © {new Date().getFullYear()} CodeCraft. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};