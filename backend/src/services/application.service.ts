import { db } from '../config/firebase';
import { IApplication, ApplicationStatus, IProject } from '../models';
import { Timestamp, FieldValue  } from 'firebase-admin/firestore';

// Obtener todas las aplicaciones de un proyecto
export const getApplicationsByProject = async (projectId: string): Promise<IApplication[]> => {
  const snapshot = await db
    .collection('applications')
    .where('projectId', '==', projectId)
    .orderBy('appliedAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as IApplication & { id: string }));
};

// Obtener todas las aplicaciones de un desarrollador
export const getApplicationsByDeveloper = async (developerUid: string): Promise<IApplication[]> => {
  const snapshot = await db
    .collection('applications')
    .where('developerUid', '==', developerUid)
    .orderBy('appliedAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as IApplication & { id: string }));
};

// Obtener una aplicación por ID
export const getApplicationById = async (applicationId: string): Promise<(IApplication & { id: string }) | null> => {
  const doc = await db.collection('applications').doc(applicationId).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
  } as IApplication & { id: string };
};

// Crear una nueva postulación
export const createApplication = async (
  applicationData: Omit<IApplication, 'appliedAt' | 'status'>
): Promise<IApplication & { id: string }> => {
  // Validaciones de negocio
  if (!applicationData.projectId) {
    throw new Error('El ID del proyecto es obligatorio');
  }
  if (!applicationData.developerUid) {
    throw new Error('El UID del desarrollador es obligatorio');
  }
  if (!applicationData.developerName) {
    throw new Error('El nombre del desarrollador es obligatorio');
  }
  if (applicationData.proposedRate === undefined || applicationData.proposedRate <= 0) {
    throw new Error('La tarifa propuesta debe ser mayor a 0');
  }

  // 1. Verificar que el proyecto existe y está abierto
  const projectDoc = await db.collection('projects').doc(applicationData.projectId).get();
  if (!projectDoc.exists) {
    throw new Error(`El proyecto con ID ${applicationData.projectId} no existe`);
  }
  const projectData = projectDoc.data() as IProject;
  if (projectData.status !== 'open') {
    throw new Error('El proyecto no está abierto para postulaciones');
  }

  // 2. Verificar que el desarrollador no sea el dueño del proyecto
  if (projectData.clientUid === applicationData.developerUid) {
    throw new Error('No puedes postularte a tu propio proyecto');
  }

  // 3. Verificar que el desarrollador tenga rol permitido (developer o both)
  const userDoc = await db.collection('users').doc(applicationData.developerUid).get();
  if (!userDoc.exists) {
    throw new Error(`El usuario con UID ${applicationData.developerUid} no existe`);
  }

  const userData = userDoc.data();
  if (!userData || (userData.role !== 'developer' && userData.role !== 'both' && userData.role !== 'admin')) {
    throw new Error('No tienes permisos para postularte a proyectos. Solo desarrolladores pueden hacerlo');
  }

  // 4. Verificar que el desarrollador no tenga ya una postulación a este proyecto (independientemente del estado)
  const existingSnapshot = await db
    .collection('applications')
    .where('projectId', '==', applicationData.projectId)
    .where('developerUid', '==', applicationData.developerUid)
    .limit(1)
    .get();

  if (!existingSnapshot.empty) {
    throw new Error('Ya has postulado a este proyecto anteriormente');
  }

  // Preparar datos para guardar
  const newApplication: Omit<IApplication, 'id'> = {
    projectId: applicationData.projectId,
    developerUid: applicationData.developerUid,
    developerName: applicationData.developerName,
    proposedRate: applicationData.proposedRate,
    coverLetter: applicationData.coverLetter || '',
    answers: applicationData.answers || [],
    status: 'pending',
    appliedAt: Timestamp.now(),
  };

  // Guardar en Firestore
  const docRef = await db.collection('applications').add(newApplication);

  // 5. Incrementar el contador de postulaciones del proyecto
  await incrementApplicantsCount(applicationData.projectId);

  // Retornar la aplicación creada
  const createdDoc = await docRef.get();
  return {
    id: docRef.id,
    ...createdDoc.data(),
  } as IApplication & { id: string };
};

// Actualizar el estado de una postulación (aceptar/rechazar)
export const updateApplicationStatus = async (
  applicationId: string,
  newStatus: ApplicationStatus,
  clientUid: string // UID del cliente que realiza la acción
): Promise<IApplication & { id: string }> => {
  // 1. Verificar que la aplicación existe
  const existing = await getApplicationById(applicationId);
  if (!existing) {
    throw new Error(`Aplicación con ID ${applicationId} no encontrada`);
  }

  // 2. Verificar que el cliente sea el dueño del proyecto
  const projectDoc = await db.collection('projects').doc(existing.projectId).get();
  if (!projectDoc.exists) {
    throw new Error(`Proyecto asociado no encontrado`);
  }
  const projectData = projectDoc.data() as IProject;
  if (projectData.clientUid !== clientUid) {
    throw new Error('No tienes permisos para modificar esta postulación');
  }

  // 3. Verificar que el proyecto esté abierto o en progreso
  if (projectData.status !== 'open' && projectData.status !== 'in-progress') {
    throw new Error('El proyecto no está en estado de aceptar/rechazar postulaciones');
  }

  // 4. Si se acepta, verificar que no se haya alcanzado el máximo de desarrolladores
  if (newStatus === 'accepted') {
    // Contar cuántas aplicaciones aceptadas hay actualmente
    const acceptedSnapshot = await db
      .collection('applications')
      .where('projectId', '==', existing.projectId)
      .where('status', '==', 'accepted')
      .get();
    
    const acceptedCount = acceptedSnapshot.size;
    if (acceptedCount >= projectData.maxDevelopersNeeded) {
      throw new Error(`El proyecto ya ha alcanzado el máximo de ${projectData.maxDevelopersNeeded} desarrolladores`);
    }
  }

  // 5. Actualizar estado de la aplicación
  await db.collection('applications').doc(applicationId).update({
    status: newStatus,
  });

  // 6. Si se acepta la primera aplicación, cambiar estado del proyecto a 'in-progress'
  if (newStatus === 'accepted') {
    // Verificar si es la primera aceptada
    const acceptedSnapshot = await db
      .collection('applications')
      .where('projectId', '==', existing.projectId)
      .where('status', '==', 'accepted')
      .get();
    
    // Si solo hay una (la que acabamos de aceptar) y el proyecto estaba 'open', lo cambiamos a 'in-progress'
    if (acceptedSnapshot.size === 1 && projectData.status === 'open') {
      await db.collection('projects').doc(existing.projectId).update({
        status: 'in-progress',
      });
    }
  }

  // 7. Si se rechaza, no hay cambios adicionales

  // Retornar la aplicación actualizada
  const updated = await getApplicationById(applicationId);
  return updated!;
};

// Eliminar una postulación (solo el dueño o admin)
export const deleteApplication = async (applicationId: string, requesterUid: string): Promise<void> => {
  const existing = await getApplicationById(applicationId);
  if (!existing) {
    throw new Error(`Aplicación con ID ${applicationId} no encontrada`);
  }

  // Verificar que el solicitante sea el dueño del proyecto o el propio desarrollador (o admin)
  const projectDoc = await db.collection('projects').doc(existing.projectId).get();
  if (!projectDoc.exists) {
    throw new Error('Proyecto no encontrado');
  }
  const projectData = projectDoc.data() as IProject;

  if (projectData.clientUid !== requesterUid && existing.developerUid !== requesterUid) {
    throw new Error('No tienes permisos para eliminar esta postulación');
  }

  await db.collection('applications').doc(applicationId).delete();
};

// Función auxiliar para incrementar contador (con la importación de admin corregida)
const incrementApplicantsCount = async (projectId: string): Promise<void> => {
  const projectRef = db.collection('projects').doc(projectId);
  await projectRef.update({
    currentApplicantsCount: FieldValue.increment(1),
  });
};