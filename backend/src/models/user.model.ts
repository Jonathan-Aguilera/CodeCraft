import { UserRole } from './common.types';
import { Timestamp } from 'firebase-admin/firestore';

export interface IUser {
  uid: string;                    // ID de Firebase Auth (clave primaria)
  email: string;                  // Correo electrónico del usuario
  displayName?: string;           // Nombre para mostrar del usuario
  photoURL?: string;              // URL de la foto de perfil del usuario
  role: UserRole;                 // Rol del usuario (admin, user, developer.)
  createdAt: Timestamp | Date;    // Fecha de creación del usuario
}