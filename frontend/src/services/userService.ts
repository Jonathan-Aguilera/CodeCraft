import { api } from './api';
import type { IUser, IApiResponse } from '../types';

export const userService = {
  // Obtener usuario por UID
  getUserByUid: (uid: string) =>
    api.get<IApiResponse<{ user: IUser }>>(`/users/${uid}`),

  // Verificar si existe un email
  checkEmailExists: (email: string) =>
    api.get<IApiResponse<{ exists: boolean }>>(`/users/exists?email=${email}`),

  // Actualizar usuario
  updateUser: (uid: string, data: Partial<IUser>) =>
    api.put<IApiResponse<{ user: IUser }>>(`/users/${uid}`, data),

  // Eliminar usuario (con precaución)
  deleteUser: (uid: string) =>
    api.delete<IApiResponse>(`/users/${uid}`),
};