// Roles de usuario
export type UserRole = 'developer' | 'client' | 'both' | 'admin';

// Disponibilidad del desarrollador
export type Availability = 'available' | 'busy' | 'unavailable';

// Tipo de pago
export type PaymentType = 'hourly' | 'fixed';

// Estado de un proyecto
export type ProjectStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

// Estado de una postulación
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

// Interfaz para enlaces sociales
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}