import { ProjectStatus, PaymentType } from './common.types';
import { Timestamp } from 'firebase-admin/firestore';

export interface IProject {
  // ID autogenerado por Firestore (no definimos campo id, lo manejamos desde el documento)
  clientUid: string;             // Referencia al uid del cliente
  clientName: string;            // Denormalizado (copia del nombre del cliente)
  title: string;
  description: string;
  requiredSkills: string[];      // Ej: ["React", "Node"]
  budgetMin: number;
  budgetMax: number;
  paymentType: PaymentType;
  maxDevelopersNeeded: number;
  currentApplicantsCount: number; // Contador de postulaciones
  status: ProjectStatus;
  createdAt: Timestamp | Date;
  recommendedRoles: string[];    // Ej: ["1 Frontend", "1 Backend"]
  deadline: Timestamp | Date;
}