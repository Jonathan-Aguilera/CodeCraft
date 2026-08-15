import { db } from '../config/firebase';
import { IReview } from '../models';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

// ---------- Funciones auxiliares ----------

// Verificar si un usuario es participante de un proyecto (cliente o dev aceptado)
const isUserParticipantInProject = async (uid: string, projectId: string): Promise<boolean> => {
  // 1. Verificar si es el cliente
  const projectDoc = await db.collection('projects').doc(projectId).get();
  if (!projectDoc.exists) return false;

  const projectData = projectDoc.data();
  if (!projectData) return false;

  if (projectData.clientUid === uid) return true;

  // 2. Verificar si tiene una aplicación aceptada
  const appSnapshot = await db
    .collection('applications')
    .where('projectId', '==', projectId)
    .where('developerUid', '==', uid)
    .where('status', '==', 'accepted')
    .limit(1)
    .get();
  return !appSnapshot.empty;
};

// Calcular promedio de rating de un objetivo (solo reseñas activas)
export const calculateAverageRating = async (targetUid: string): Promise<number> => {
  const snapshot = await db
    .collection('reviews')
    .where('targetUid', '==', targetUid)
    .where('isActive', '==', true)
    .get();

  if (snapshot.empty) return 0;
  const ratings = snapshot.docs.map(doc => doc.data().rating);
  const sum = ratings.reduce((a, b) => a + b, 0);
  const avg = sum / ratings.length;
  return Math.round(avg * 10) / 10; // Redondear a 1 decimal
};

// ---------- Funciones de consulta ----------

// Obtener todas las reseñas (solo admin)
export const getAllReviews = async (): Promise<IReview[]> => {
  const snapshot = await db.collection('reviews').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IReview & { id: string }));
};

// Obtener reseñas por autor (userUid)
export const getReviewsByAuthor = async (userUid: string): Promise<IReview[]> => {
  const snapshot = await db
    .collection('reviews')
    .where('userUid', '==', userUid)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IReview & { id: string }));
};

// Obtener reseñas por objetivo (targetUid)
export const getReviewsByTarget = async (targetUid: string): Promise<IReview[]> => {
  const snapshot = await db
    .collection('reviews')
    .where('targetUid', '==', targetUid)
    .where('isActive', '==', true)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IReview & { id: string }));
};

// Obtener reseñas por proyecto
export const getReviewsByProject = async (projectId: string): Promise<IReview[]> => {
  const snapshot = await db
    .collection('reviews')
    .where('projectId', '==', projectId)
    .where('isActive', '==', true)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IReview & { id: string }));
};

// Obtener una reseña por ID
export const getReviewById = async (reviewId: string): Promise<(IReview & { id: string }) | null> => {
  const doc = await db.collection('reviews').doc(reviewId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as IReview & { id: string };
};

// Obtener reseñas reportadas (ordenadas por numbAlert desc) - solo admin
export const getReportedReviews = async (limit?: number): Promise<IReview[]> => {
  let query = db.collection('reviews')
    .where('isAlerted', '==', true)
    .orderBy('numbAlert', 'desc');
  if (limit) query = query.limit(limit);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IReview & { id: string }));
};

// ---------- Crear reseña ----------
export const createReview = async (
  reviewData: Omit<IReview, 'createdAt' | 'updatedAt' | 'isActive' | 'isAlerted' | 'numbAlert'>
): Promise<IReview & { id: string }> => {
  // Validaciones básicas
  if (!reviewData.targetUid) throw new Error('El objetivo de la reseña es obligatorio');
  if (!reviewData.userUid) throw new Error('El autor de la reseña es obligatorio');
  if (reviewData.userUid === reviewData.targetUid) throw new Error('No puedes reseñarte a ti mismo');
  if (reviewData.rating === undefined || reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error('La calificación debe ser un número entre 1 y 5');
  }

  // 1. Verificar que el objetivo existe (en users)
  const targetDoc = await db.collection('users').doc(reviewData.targetUid).get();
  if (!targetDoc.exists) throw new Error(`El usuario objetivo con UID ${reviewData.targetUid} no existe`);

  // 2. Verificar que el autor existe
  const authorDoc = await db.collection('users').doc(reviewData.userUid).get();
  if (!authorDoc.exists) throw new Error(`El autor con UID ${reviewData.userUid} no existe`);

  // 3. Si tiene projectId, validar participación y estado del proyecto
  if (reviewData.projectId) {
    const projectDoc = await db.collection('projects').doc(reviewData.projectId).get();
    if (!projectDoc.exists) throw new Error(`El proyecto con ID ${reviewData.projectId} no existe`);
    const projectData = projectDoc.data();
    if (!projectData) {
      throw new Error(`No se pudo obtener la información del proyecto con ID ${reviewData.projectId}`);
    }

    // Verificar que el objetivo sea participante del proyecto
    const isTargetParticipant = await isUserParticipantInProject(reviewData.targetUid, reviewData.projectId);
    if (!isTargetParticipant) {
      throw new Error('El objetivo de la reseña no participa en este proyecto');
    }

    // Verificar estado del proyecto para permitir reseñar
    const isCompleted = projectData.status === 'completed';
    if (!isCompleted) {
      // Si no está completado, solo participantes pueden reseñar
      const isAuthorParticipant = await isUserParticipantInProject(reviewData.userUid, reviewData.projectId);
      if (!isAuthorParticipant) {
        throw new Error('El proyecto no está completado, solo los participantes pueden dejar reseñas');
      }
    }
    // Si está completado, cualquiera puede reseñar (no se requiere que el autor sea participante)

    // Verificar duplicado: misma combinación (userUid, targetUid, projectId)
    const dupSnapshot = await db
      .collection('reviews')
      .where('userUid', '==', reviewData.userUid)
      .where('targetUid', '==', reviewData.targetUid)
      .where('projectId', '==', reviewData.projectId)
      .limit(1)
      .get();
    if (!dupSnapshot.empty) {
      throw new Error('Ya has dejado una reseña para este proyecto y este usuario');
    }
  } else {
    // Reseña directa (sin projectId): verificar duplicado (userUid + targetUid sin projectId)
    const dupSnapshot = await db
      .collection('reviews')
      .where('userUid', '==', reviewData.userUid)
      .where('targetUid', '==', reviewData.targetUid)
      .where('projectId', '==', null)
      .limit(1)
      .get();
    if (!dupSnapshot.empty) {
      throw new Error('Ya has dejado una reseña directa para este usuario');
    }
  }

  // Preparar datos
  const newReview = {
    projectId: reviewData.projectId ?? null, // Puede ser null si es reseña directa
    targetUid: reviewData.targetUid,
    userUid: reviewData.userUid,
    rating: reviewData.rating,
    comment: reviewData.comment?.trim() || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isActive: true,
    isAlerted: false,
    numbAlert: 0,
  } as Omit<IReview, 'id'> & { projectId: string | null };

  const docRef = await db.collection('reviews').add(newReview);
  const created = await docRef.get();
  return { id: docRef.id, ...created.data() } as IReview & { id: string };
};

// ---------- Actualizar reseña (solo autor) ----------
export const updateReview = async (
  reviewId: string,
  userUid: string,
  updates: { rating?: number; comment?: string }
): Promise<IReview & { id: string }> => {
  const existing = await getReviewById(reviewId);
  if (!existing) throw new Error(`Reseña con ID ${reviewId} no encontrada`);
  if (existing.userUid !== userUid) throw new Error('No tienes permiso para actualizar esta reseña');
  if (!existing.isActive) throw new Error('No se puede actualizar una reseña eliminada por un moderador');

  const updateData: any = { updatedAt: Timestamp.now() };
  if (updates.rating !== undefined) {
    if (updates.rating < 1 || updates.rating > 5) throw new Error('La calificación debe ser entre 1 y 5');
    updateData.rating = updates.rating;
  }
  if (updates.comment !== undefined) {
    updateData.comment = updates.comment.trim() || '';
  }

  if (Object.keys(updateData).length === 1) throw new Error('No se proporcionaron campos para actualizar');

  await db.collection('reviews').doc(reviewId).update(updateData);
  const updated = await getReviewById(reviewId);
  return updated!;
};

// ---------- Eliminar reseña (autor: borrado físico, admin: lógico) ----------
export const deleteReview = async (
  reviewId: string,
  requesterUid: string,
  isAdmin: boolean = false
): Promise<void> => {
  const existing = await getReviewById(reviewId);
  if (!existing) throw new Error(`Reseña con ID ${reviewId} no encontrada`);

  // Si es admin, hacer borrado lógico
  if (isAdmin) {
    if (!existing.isActive) throw new Error('Esta reseña ya fue eliminada por un moderador');
    await db.collection('reviews').doc(reviewId).update({
      rating: -1,
      comment: 'Eliminado por un moderador',
      isActive: false,
      updatedAt: Timestamp.now(),
    });
    return;
  }

  // Si es autor, borrado físico
  if (existing.userUid !== requesterUid) {
    throw new Error('No tienes permiso para eliminar esta reseña');
  }
  if (!existing.isActive) {
    throw new Error('No puedes eliminar una reseña que ya fue eliminada por un moderador');
  }
  await db.collection('reviews').doc(reviewId).delete();
};

// ---------- Reportar reseña ----------
export const reportReview = async (
  reviewId: string,
  reporterUid: string
): Promise<IReview & { id: string }> => {
  const existing = await getReviewById(reviewId);
  if (!existing) throw new Error(`Reseña con ID ${reviewId} no encontrada`);
  if (!existing.isActive) throw new Error('No se puede reportar una reseña eliminada por un moderador');
  if (existing.userUid === reporterUid) throw new Error('No puedes reportar tu propia reseña');

  // Incrementar numbAlert hasta 3
  const newNumbAlert = Math.min(existing.numbAlert + 1, 3);
  const isAlerted = newNumbAlert >= 1;

  await db.collection('reviews').doc(reviewId).update({
    numbAlert: newNumbAlert,
    isAlerted: isAlerted,
    updatedAt: Timestamp.now(),
  });

  const updated = await getReviewById(reviewId);
  return updated!;
};