import { api } from './api';
import type { IReview, IApiResponse } from '../types';

export const reviewService = {
  // Obtener reseñas de un objetivo
  getReviewsByTarget: (targetUid: string, requesterUid?: string, isAdmin?: boolean) =>
    api.get<IApiResponse<{ reviews: IReview[]; count: number; averageRating: number }>>(
      `/reviews/target/${targetUid}`,
      { params: { requesterUid, isAdmin } }
    ),

  // Obtener reseñas de un autor
  getReviewsByAuthor: (userUid: string, requesterUid?: string, isAdmin?: boolean) =>
    api.get<IApiResponse<{ reviews: IReview[]; count: number }>>(
      `/reviews/author/${userUid}`,
      { params: { requesterUid, isAdmin } }
    ),

  // Obtener reseñas de un proyecto
  getReviewsByProject: (projectId: string) =>
    api.get<IApiResponse<{ reviews: IReview[]; count: number }>>(`/reviews/project/${projectId}`),

  // Crear una reseña
  createReview: (data: Omit<IReview, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isAlerted' | 'numbAlert'>) =>
    api.post<IApiResponse<{ review: IReview }>>('/reviews', data),

  // Actualizar reseña
  updateReview: (id: string, data: { rating?: number; comment?: string; userUid: string }) =>
    api.put<IApiResponse<{ review: IReview }>>(`/reviews/${id}`, data),

  // Eliminar reseña
  deleteReview: (id: string, requesterUid: string, isAdmin: boolean = false) =>
    api.delete<IApiResponse>(`/reviews/${id}`, { data: { requesterUid, isAdmin } }),

  // Reportar reseña
  reportReview: (id: string, reporterUid: string) =>
    api.put<IApiResponse<{ review: IReview }>>(`/reviews/${id}/report`, { reporterUid }),
};