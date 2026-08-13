import { Availability, SocialLinks } from './common.types';

export interface IDeveloperProfile {
  uid: string;                // Mismo UID que el usuario (clave primaria)
  title?: string;             // Título profesional (ej: "Ingeniero de Software")
  bio?: string;
  skills: string[];           // Ej: ["React", "Node.js", "Firebase"]
  experienceYears?: number;   // Años de experiencia
  hourlyRate?: number;        // Tarifa por hora (opcional)
  availability: Availability; // 'available' | 'busy' | 'unavailable'
  totalCompletedProjects: number; // Calculado automáticamente
  averageRating: number;      // Calculado automáticamente
  socialLinks?: SocialLinks;  // Objeto con github, linkedin, portfolio
  cvUrl?: string;             // URL del CV (opcional, nuevo campo)
}