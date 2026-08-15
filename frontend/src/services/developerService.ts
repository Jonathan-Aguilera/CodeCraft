import { api } from './api';
import type { IDeveloperProfile, IApiResponse } from '../types';

export const developerService = {
  // Obtener todos los perfiles (con filtros)
  getProfiles: (filters?: { skills?: string; availability?: string; minRate?: number; maxRate?: number; minRating?: number }) =>
    api.get<IApiResponse<{ profiles: IDeveloperProfile[]; count: number }>>('/developer-profiles', { params: filters }),

  // Obtener perfil por UID
  getProfileByUid: (uid: string) =>
    api.get<IApiResponse<{ profile: IDeveloperProfile }>>(`/developer-profiles/${uid}`),

  // Crear perfil
  createProfile: (data: Omit<IDeveloperProfile, 'totalCompletedProjects' | 'averageRating'>) =>
    api.post<IApiResponse<{ profile: IDeveloperProfile }>>('/developer-profiles', data),

  // Actualizar perfil
  updateProfile: (uid: string, data: Partial<IDeveloperProfile>) =>
    api.put<IApiResponse<{ profile: IDeveloperProfile }>>(`/developer-profiles/${uid}`, data),

  // Eliminar perfil
  deleteProfile: (uid: string) =>
    api.delete<IApiResponse>(`/developer-profiles/${uid}`),
};