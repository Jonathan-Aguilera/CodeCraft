import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer
      className="border-t-2 border-amber-900/40 px-4 py-8 md:px-6"
      style={{
        /* Degradado radial: centro café claro, bordes café muy oscuro */
        background: 'radial-gradient(circle at center, #3E2723 0%, #201210 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-emerald-400">CodeCraft</h3>
            <p className="mt-2 text-sm text-amber-100/80">
              Conectamos talento tecnológico con oportunidades.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-amber-200">Producto</h4>
            <ul className="mt-2 space-y-2 text-sm text-amber-100/80">
              <li><Link to="/developers" className="hover:text-emerald-300">Talentos</Link></li>
              <li><Link to="/projects" className="hover:text-emerald-300">Proyectos</Link></li>
              <li><Link to="/about" className="hover:text-emerald-300">Sobre Nosotros</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-amber-200">Compañía</h4>
            <ul className="mt-2 space-y-2 text-sm text-amber-100/80">
              <li><Link to="/about" className="hover:text-emerald-300">Quiénes somos</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-300">Términos</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-300">Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-amber-200">Síguenos</h4>
            <div className="mt-2 flex space-x-3">
              <a href="#" className="text-amber-100/80 hover:text-emerald-300" aria-label="GitHub">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-amber-100/80 hover:text-emerald-300" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-amber-100/80 hover:text-emerald-300" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-amber-100/80 hover:text-emerald-300" aria-label="Email">
                <FaEnvelope size={20} />
              </a>
            </div>
            <p className="mt-3 text-xs text-amber-100/60">
              © {new Date().getFullYear()} CodeCraft. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};