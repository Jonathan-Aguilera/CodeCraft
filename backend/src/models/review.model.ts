import { Timestamp } from 'firebase-admin/firestore';

export interface IReview {
  // ID autogenerado por Firestore
  projectId: string;
  developerUid: string;           // Dev calificado
  clientUid: string;              // Cliente que escribe la reseña
  rating: number;                 // 1-5
  comment?: string;               // Comentario opcional, anónimo
  createdAt: Timestamp | Date;
}