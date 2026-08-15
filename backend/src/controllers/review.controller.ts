import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';

// Función auxiliar para normalizar parámetros
const getStringParam = (value: any): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

// Obtener todas las reseñas (solo admin)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const isAdmin = getStringParam(req.query.isAdmin);
    if (!isAdmin || isAdmin !== 'true') {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Solo administradores.' });
    }
    const reviews = await reviewService.getAllReviews();
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener reseñas', error: error.message });
  }
};

// Obtener reseñas por autor (solo autor o admin)
export const getReviewsByAuthor = async (req: Request, res: Response) => {
  try {
    const userUid = getStringParam(req.params.userUid);
    if (!userUid) {
      return res.status(400).json({ success: false, message: 'userUid es requerido' });
    }
    const requesterUid = getStringParam(req.query.requesterUid);
    const isAdmin = getStringParam(req.query.isAdmin);
    if (requesterUid !== userUid && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver estas reseñas' });
    }
    const reviews = await reviewService.getReviewsByAuthor(userUid);
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener reseñas del autor', error: error.message });
  }
};

// Obtener reseñas por objetivo (solo objetivo o admin)
export const getReviewsByTarget = async (req: Request, res: Response) => {
  try {
    const targetUid = getStringParam(req.params.targetUid);
    if (!targetUid) {
      return res.status(400).json({ success: false, message: 'targetUid es requerido' });
    }
    const requesterUid = getStringParam(req.query.requesterUid);
    const isAdmin = getStringParam(req.query.isAdmin);
    if (requesterUid !== targetUid && isAdmin !== 'true') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver estas reseñas' });
    }
    const reviews = await reviewService.getReviewsByTarget(targetUid);
    const average = await reviewService.calculateAverageRating(targetUid);
    return res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: average,
      reviews,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener reseñas del objetivo', error: error.message });
  }
};

// Obtener reseñas por proyecto (público)
export const getReviewsByProject = async (req: Request, res: Response) => {
  try {
    const projectId = getStringParam(req.params.projectId);
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId es requerido' });
    }
    const reviews = await reviewService.getReviewsByProject(projectId);
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener reseñas del proyecto', error: error.message });
  }
};

// Obtener reseña por ID (público)
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID de reseña requerido' });
    }
    const review = await reviewService.getReviewById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    return res.status(200).json({ success: true, review });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener reseña', error: error.message });
  }
};

// Obtener reseñas reportadas (solo admin)
export const getReportedReviews = async (req: Request, res: Response) => {
  try {
    const isAdmin = getStringParam(req.query.isAdmin);
    if (!isAdmin || isAdmin !== 'true') {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Solo administradores.' });
    }
    const limit = getStringParam(req.query.limit);
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const reviews = await reviewService.getReportedReviews(limitNum);
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener reseñas reportadas', error: error.message });
  }
};

// Obtener rating promedio de un usuario (público)
export const getAverageRating = async (req: Request, res: Response) => {
  try {
    const targetUid = getStringParam(req.params.targetUid);
    if (!targetUid) {
      return res.status(400).json({ success: false, message: 'targetUid es requerido' });
    }
    const average = await reviewService.calculateAverageRating(targetUid);
    return res.status(200).json({ success: true, targetUid, averageRating: average });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al calcular rating promedio', error: error.message });
  }
};

// Crear reseña
export const createReview = async (req: Request, res: Response) => {
  try {
    const reviewData = req.body;
    const newReview = await reviewService.createReview(reviewData);
    return res.status(201).json({ success: true, message: 'Reseña creada exitosamente', review: newReview });
  } catch (error: any) {
    const status = error.message.includes('obligatorio') || error.message.includes('Ya has') || error.message.includes('participa') ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// Actualizar reseña
export const updateReview = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID de reseña requerido' });
    }
    const { userUid, rating, comment } = req.body;
    if (!userUid) return res.status(400).json({ success: false, message: 'userUid es requerido' });
    const updated = await reviewService.updateReview(id, userUid, { rating, comment });
    return res.status(200).json({ success: true, message: 'Reseña actualizada', review: updated });
  } catch (error: any) {
    const status = error.message.includes('permiso') || error.message.includes('encontrada') || error.message.includes('eliminada') ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// Eliminar reseña
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID de reseña requerido' });
    }
    const { requesterUid, isAdmin } = req.body;
    if (!requesterUid) return res.status(400).json({ success: false, message: 'requesterUid es requerido' });
    await reviewService.deleteReview(id, requesterUid, isAdmin || false);
    return res.status(200).json({ success: true, message: 'Reseña eliminada exitosamente' });
  } catch (error: any) {
    const status = error.message.includes('permiso') || error.message.includes('encontrada') ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// Reportar reseña
export const reportReview = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID de reseña requerido' });
    }
    const { reporterUid } = req.body;
    if (!reporterUid) return res.status(400).json({ success: false, message: 'reporterUid es requerido' });
    const updated = await reviewService.reportReview(id, reporterUid);
    return res.status(200).json({ success: true, message: 'Reseña reportada', review: updated });
  } catch (error: any) {
    const status = error.message.includes('permiso') || error.message.includes('encontrada') ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};