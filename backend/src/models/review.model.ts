import { Timestamp } from 'firebase-admin/firestore';

export interface IReview {
  projectId?: string;           // Opcional: si es de proyecto
  targetUid: string;            // Objetivo de la reseña (puede ser dev, cliente, admin)
  userUid: string;              // Quien escribe la reseña
  rating: number;               // 0-5 (0 = sin valoración, pero en uso normal 1-5)
  comment?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  isActive: boolean;            // true por defecto
  isAlerted: boolean;           // true si ha sido reportada (numbAlert >= 1)
  numbAlert: number;            // contador de reportes (máx 3)
}