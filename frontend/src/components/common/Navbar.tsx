import { Link } from 'react-router-dom';

interface NavLink {
  to: string;
  label: string;
}

interface NavbarProps {
  links: NavLink[];
  className?: string;
}

export const Navbar = ({ links, className = '' }: NavbarProps) => {
  return (
    <nav className={`flex items-center gap-3 text-sm font-medium ${className}`}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="px-3 py-2 text-emerald-950 bg-white/40 rounded-lg hover:bg-white/70 hover:text-emerald-800 transition-all duration-200"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};