import { api } from './api';
import type { IProject, IApiResponse } from '../types';

export const projectService = {
  // Obtener todos los proyectos (con filtros)
  getProjects: (filters?: { status?: string; skills?: string; minBudget?: number; maxBudget?: number }) =>
    api.get<IApiResponse<{ projects: IProject[]; count: number }>>('/projects', { params: filters }),

  // Obtener un proyecto por ID
  getProjectById: (id: string) =>
    api.get<IApiResponse<{ project: IProject }>>(`/projects/${id}`),

  // Crear un nuevo proyecto
  createProject: (data: Omit<IProject, 'id' | 'createdAt' | 'currentApplicantsCount'>) =>
    api.post<IApiResponse<{ project: IProject }>>('/projects', data),

  // Actualizar proyecto
  updateProject: (id: string, data: Partial<IProject>) =>
    api.put<IApiResponse<{ project: IProject }>>(`/projects/${id}`, data),

  // Eliminar proyecto
  deleteProject: (id: string) =>
    api.delete<IApiResponse>(`/projects/${id}`),
};