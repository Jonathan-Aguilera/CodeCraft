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
    <nav className={`flex items-center gap-6 text-sm font-medium ${className}`}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-gray-300 transition-colors hover:text-emerald-400"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};