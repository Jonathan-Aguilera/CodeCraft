import { Availability, SocialLinks } from './common.types';

export interface IDeveloperProfile {
  uid: string;                // Mismo UID que el usuario (clave primaria)
  title?: string;             // Título profesional
  bio?: string;
  skills: string[];           // Ej: ["React", "Node.js", "Firebase"]
  experienceYears?: number;
  hourlyRate?: number;
  availability: Availability;
  totalCompletedProjects: number;
  averageRating: number;
  socialLinks?: SocialLinks;
  // A futuro: URL del CV 
  //cvUrl?: string;
}