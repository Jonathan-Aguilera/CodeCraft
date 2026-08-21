// ---------- TIPOS COMPARTIDOS ----------
export type UserRole = 'developer' | 'client' | 'both' | 'admin';
export type Availability = 'available' | 'busy' | 'unavailable';
export type PaymentType = 'hourly' | 'fixed';
export type ProjectStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

// ---------- USUARIOS ----------
export interface IUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string | Date;
}

// ---------- PERFILES DE DESARROLLADOR ----------
export interface IDeveloperProfile {
  uid: string;
  title?: string;
  bio?: string;
  skills: string[];
  experienceYears?: number;
  hourlyRate?: number;
  availability: Availability;
  totalCompletedProjects: number;
  averageRating: number;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  cvUrl?: string;
}

// ---------- PROYECTOS ----------
export interface IProject {
  id: string; // ID autogenerado por Firestore
  clientUid: string;
  clientName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budgetMin: number;
  budgetMax: number;
  paymentType: PaymentType;
  maxDevelopersNeeded: number;
  currentApplicantsCount: number;
  status: ProjectStatus;
  createdAt: string | Date;
  recommendedRoles: string[];
  deadline?: string | Date;
}

// ---------- APLICACIONES (POSTULACIONES) ----------
export interface IApplication {
  id: string;
  projectId: string;
  developerUid: string;
  developerName: string;
  proposedRate: number;
  coverLetter?: string;
  answers?: string[];
  status: ApplicationStatus;
  appliedAt: string | Date;
}

// ---------- RESEÑAS ----------
export interface IReview {
  id: string;
  projectId?: string;
  targetUid: string;      // Objetivo de la reseña
  userUid: string;        // Quien la escribe
  rating: number;
  comment?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  isActive: boolean;
  isAlerted: boolean;
  numbAlert: number;
}

// ---------- RESPUESTAS DE API (Estructura común) ----------
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// ---------- DATOS DE AUTENTICACIÓN ----------
export interface IAuthPayload {
  uid: string;
  email: string;
  role: UserRole; // 'developer' | 'client' | 'both' | 'admin'
  displayName?: string;
  photoURL?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterCredentials {
  email: string;
  password: string;
  displayName?: string;
  role: UserRole;
}