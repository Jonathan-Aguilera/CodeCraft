import { db } from '../config/firebase';
import { IDeveloperProfile, Availability, UserRole } from '../models';
import { Timestamp } from 'firebase-admin/firestore';

// Obtener todos los perfiles (con filtros opcionales)
export const getDeveloperProfiles = async (filters?: {
  skills?: string[];
  availability?: Availability;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
}): Promise<IDeveloperProfile[]> => {
  let query: FirebaseFirestore.Query = db.collection('developerProfiles');

  if (filters?.availability) {
    query = query.where('availability', '==', filters.availability);
  }
  if (filters?.minRating !== undefined) {
    query = query.where('averageRating', '>=', filters.minRating);
  }
  if (filters?.minRate !== undefined) {
    query = query.where('hourlyRate', '>=', filters.minRate);
  }
  if (filters?.maxRate !== undefined) {
    query = query.where('hourlyRate', '<=', filters.maxRate);
  }
  if (filters?.skills && filters.skills.length > 0) {
    // Solo soportamos un skill por ahora (array-contains)
    query = query.where('skills', 'array-contains', filters.skills[0]);
  }

  const snapshot = await query.orderBy('averageRating', 'desc').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as IDeveloperProfile & { id: string }));
};

// Obtener un perfil por UID
export const getProfileByUid = async (uid: string): Promise<(IDeveloperProfile & { id: string }) | null> => {
  const doc = await db.collection('developerProfiles').doc(uid).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
  } as IDeveloperProfile & { id: string };
};

// Crear un perfil de desarrollador (solo si el usuario tiene rol permitido)
export const createDeveloperProfile = async (
  profileData: Omit<IDeveloperProfile, 'totalCompletedProjects' | 'averageRating'>
): Promise<IDeveloperProfile & { id: string }> => {
  // Validaciones de negocio
  if (!profileData.uid) {
    throw new Error('El UID del usuario es obligatorio');
  }

  // 1. Verificar que el usuario existe y tiene rol permitido
  const userDoc = await db.collection('users').doc(profileData.uid).get();
  if (!userDoc.exists) {
    throw new Error(`El usuario con UID ${profileData.uid} no existe`);
  }
  const userData = userDoc.data();
  if (!userData) {
    throw new Error(`Los datos del usuario con UID ${profileData.uid} no se pudieron obtener`);
  }
  const allowedRoles: UserRole[] = ['developer', 'both', 'admin'];
  if (!allowedRoles.includes(userData.role)) {
    throw new Error('El usuario no tiene un rol que permita perfil de desarrollador (developer, both o admin)');
  }

  // 2. Verificar que no exista ya un perfil para este usuario
  const existing = await getProfileByUid(profileData.uid);
  if (existing) {
    throw new Error(`Ya existe un perfil para el usuario ${profileData.uid}`);
  }

  // 3. Preparar datos con valores por defecto
  const newProfile: Omit<IDeveloperProfile, 'id'> = {
    uid: profileData.uid,
    title: profileData.title?.trim() || 'No especificado',
    bio: profileData.bio?.trim() || '',
    skills: profileData.skills || [],
    experienceYears: profileData.experienceYears ?? 0,
    hourlyRate: profileData.hourlyRate ?? undefined,
    availability: profileData.availability || 'available',
    totalCompletedProjects: 0,
    averageRating: 0,
    socialLinks: profileData.socialLinks || {},
    cvUrl: profileData.cvUrl?.trim() || '',
  };

  // Guardar en Firestore (usando el UID como ID del documento)
  await db.collection('developerProfiles').doc(profileData.uid).set(newProfile);

  // Retornar el perfil creado
  const created = await getProfileByUid(profileData.uid);
  return created!;
};

// Actualizar un perfil existente (solo el dueño o admin puede hacerlo, pero la autorización va en el controlador/middleware)
export const updateDeveloperProfile = async (
  uid: string,
  updates: Partial<Omit<IDeveloperProfile, 'uid' | 'totalCompletedProjects' | 'averageRating'>>
): Promise<IDeveloperProfile & { id: string }> => {
  // 1. Verificar que el perfil existe
  const existing = await getProfileByUid(uid);
  if (!existing) {
    throw new Error(`Perfil para el usuario ${uid} no encontrado`);
  }

  // 2. Verificar que no se intente actualizar campos inmutables
  if ('uid' in updates && updates.uid !== undefined) {
    throw new Error('No se puede cambiar el UID del perfil');
  }
  if ('totalCompletedProjects' in updates && updates.totalCompletedProjects !== undefined) {
    throw new Error('No se puede modificar el total de proyectos completados manualmente');
  }
  if ('averageRating' in updates && updates.averageRating !== undefined) {
    throw new Error('No se puede modificar el rating promedio manualmente');
  }

  // 3. Preparar datos a actualizar (limpiar undefined y trim)
  const updateData: any = { ...updates };
  // Si se actualiza title, asegurar que no esté vacío
  if (updateData.title !== undefined) {
    updateData.title = updateData.title?.trim() || 'No especificado';
  }
  if (updateData.bio !== undefined) {
    updateData.bio = updateData.bio?.trim() || '';
  }
  if (updateData.cvUrl !== undefined) {
    updateData.cvUrl = updateData.cvUrl?.trim() || '';
  }
  // Eliminar propiedades undefined
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) delete updateData[key];
  });

  // 4. Actualizar en Firestore
  await db.collection('developerProfiles').doc(uid).update(updateData);

  // Retornar perfil actualizado
  const updated = await getProfileByUid(uid);
  return updated!;
};

// Eliminar un perfil (solo el dueño o admin)
export const deleteDeveloperProfile = async (uid: string): Promise<void> => {
  const existing = await getProfileByUid(uid);
  if (!existing) {
    throw new Error(`Perfil para el usuario ${uid} no encontrado`);
  }
  await db.collection('developerProfiles').doc(uid).delete();
};