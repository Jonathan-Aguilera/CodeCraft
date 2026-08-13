import { db } from '../config/firebase';
import { IUser, UserRole } from '../models';
import { Timestamp } from 'firebase-admin/firestore';

// 1. Consultar usuario por email (devuelve true si existe, false si no)
export const userExistsByEmail = async (email: string): Promise<boolean> => {
  const snapshot = await db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();
  return !snapshot.empty;
};

// 2. Obtener usuario por UID
export const getUserByUid = async (uid: string): Promise<IUser | null> => {
  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as IUser;
};

// 3. Obtener usuario por email (devuelve el usuario completo o null)
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const snapshot = await db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return doc.data() as IUser;
};

// 4. Crear un nuevo usuario (con validaciones de negocio)
export const createUser = async (
  userData: Omit<IUser, 'uid' | 'createdAt'> & { uid?: string } // uid opcional, lo generamos nosotros
): Promise<IUser> => {
  // Validación: no se permite crear usuarios con rol 'admin'
  if (userData.role === 'admin') {
    throw new Error('No se pueden crear usuarios con rol admin desde este servicio');
  }

  // Validación: email único
  const exists = await userExistsByEmail(userData.email);
  if (exists) {
    throw new Error(`El email ${userData.email} ya está registrado`);
  }

  // Generar un UID único (podría ser el de Firebase Auth, pero aquí lo generamos nosotros)
  // Para mantener coherencia, usaremos un ID generado por Firestore o un UUID.
  // Como aún no tenemos Firebase Auth, generaremos un ID numérico secuencial (solo para pruebas).
  // En producción, usarás el UID de Firebase Auth.
  const uid = userData.uid || `user_${Date.now()}`; // Temporal

  const newUser: IUser = {
    uid,
    email: userData.email,
    displayName: userData.displayName || '',
    photoURL: userData.photoURL || '',
    role: userData.role,
    createdAt: Timestamp.now(),
  };

  await db.collection('users').doc(uid).set(newUser);
  return newUser;
};

// 5. Actualizar un usuario existente (solo campos permitidos)
export const updateUser = async (
  uid: string,
  updates: Partial<Omit<IUser, 'uid' | 'email' | 'createdAt'>> // No se puede cambiar email, uid ni createdAt
): Promise<IUser> => {
  // Verificar que el usuario existe
  const existing = await getUserByUid(uid);
  if (!existing) {
    throw new Error(`Usuario con UID ${uid} no encontrado`);
  }

  // Validación: no se puede cambiar el rol a 'admin'
  if (updates.role === 'admin') {
    throw new Error('No se puede asignar el rol admin desde este servicio');
  }

  // Preparar datos a actualizar
  const updateData: any = { ...updates };
  // Eliminar campos que no se pueden actualizar (por si acaso)
  delete updateData.uid;
  delete updateData.email;
  delete updateData.createdAt;

  await db.collection('users').doc(uid).update(updateData);

  // Retornar el usuario actualizado
  const updated = await getUserByUid(uid);
  return updated!;
};

// 6. Eliminar un usuario (opcional, pero lo añadimos por completitud)
export const deleteUser = async (uid: string): Promise<void> => {
  const existing = await getUserByUid(uid);
  if (!existing) {
    throw new Error(`Usuario con UID ${uid} no encontrado`);
  }
  await db.collection('users').doc(uid).delete();
};