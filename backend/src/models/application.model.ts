import { ApplicationStatus } from './common.types';
import { Timestamp } from 'firebase-admin/firestore';

export interface IApplication {
  // ID autogenerado por Firestore
  projectId: string;              // Referencia al proyecto
  developerUid: string;           // Referencia al dev
  developerName: string;          // Denormalizado (copia del nombre del dev)
  proposedRate: number;           // Tarifa que propone el dev para este proyecto
  coverLetter?: string;
  answers?: string[];             // Respuestas al cuestionario (si existe)
  status: ApplicationStatus;
  appliedAt: Timestamp | Date;
}