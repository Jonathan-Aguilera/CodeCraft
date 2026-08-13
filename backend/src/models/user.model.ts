import { UserRole } from './common.types';
import { Timestamp } from 'firebase-admin/firestore';

export interface IUser {
  uid: string;                // ID de Firebase Auth (clave primaria)
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Timestamp | Date;
}