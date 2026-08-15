import { api } from './api';
import type { IApplication, IApiResponse } from '../types';

export const applicationService = {
  // Obtener postulaciones de un proyecto
  getByProject: (projectId: string) =>
    api.get<IApiResponse<{ applications: IApplication[]; count: number }>>(`/applications/project/${projectId}`),

  // Obtener postulaciones de un desarrollador
  getByDeveloper: (developerUid: string) =>
    api.get<IApiResponse<{ applications: IApplication[]; count: number }>>(`/applications/developer/${developerUid}`),

  // Crear una postulación
  create: (data: Omit<IApplication, 'id' | 'appliedAt' | 'status'>) =>
    api.post<IApiResponse<{ application: IApplication }>>('/applications', data),

  // Actualizar estado (aceptar/rechazar)
  updateStatus: (applicationId: string, status: 'accepted' | 'rejected', clientUid: string) =>
    api.put<IApiResponse<{ application: IApplication }>>(`/applications/${applicationId}/status`, { status, clientUid }),

  // Eliminar postulación
  delete: (applicationId: string, requesterUid: string) =>
    api.delete<IApiResponse>(`/applications/${applicationId}`, { data: { requesterUid } }),
};