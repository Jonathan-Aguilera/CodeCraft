import { db } from '../config/firebase';
import { IProject, ProjectStatus, PaymentType } from '../models';
import { Timestamp } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

// Obtener todos los proyectos (con filtros opcionales)
export const getProjects = async (filters?: {
    status?: ProjectStatus;
    skills?: string[];
    minBudget?: number;
    maxBudget?: number;
}): Promise<IProject[]> => {
    let query: FirebaseFirestore.Query = db.collection('projects');

    if (filters?.status) {
        query = query.where('status', '==', filters.status);
    }
    if (filters?.skills && filters.skills.length > 0) {
        // Firestore solo permite un array-contains por consulta
        // Tomamos la primera skill para filtrar (mejorable con índices compuestos)
        query = query.where('requiredSkills', 'array-contains', filters.skills[0]);
    }
    if (filters?.minBudget !== undefined) {
        query = query.where('budgetMin', '>=', filters.minBudget);
    }
    if (filters?.maxBudget !== undefined) {
        query = query.where('budgetMax', '<=', filters.maxBudget);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as IProject & { id: string }));
};

// Obtener un proyecto por ID
export const getProjectById = async (projectId: string): Promise<(IProject & { id: string }) | null> => {
    const doc = await db.collection('projects').doc(projectId).get();
    if (!doc.exists) return null;
    return {
        id: doc.id,
        ...doc.data(),
    } as IProject & { id: string };
};

// Crear un nuevo proyecto
export const createProject = async (
    projectData: Omit<IProject, 'createdAt' | 'currentApplicantsCount'>
): Promise<IProject & { id: string }> => {
    // Validaciones de negocio
    if (!projectData.clientUid) {
        throw new Error('El UID del cliente es obligatorio');
    }
    if (!projectData.clientName) {
        throw new Error('El nombre del cliente es obligatorio');
    }
    if (!projectData.title || projectData.title.trim() === '') {
        throw new Error('El título es obligatorio');
    }
    if (!projectData.description || projectData.description.trim() === '') {
        throw new Error('La descripción es obligatoria');
    }
    if (!projectData.paymentType) {
        throw new Error('El tipo de pago es obligatorio');
    }
    if (!projectData.status) {
        throw new Error('El estado es obligatorio');
    }
    // Validación de presupuesto
    if (projectData.budgetMin === undefined || projectData.budgetMin === null || projectData.budgetMin <= 0) {
        throw new Error('El presupuesto mínimo debe ser mayor a 0');
    }
    if (projectData.budgetMax === undefined || projectData.budgetMax === null || projectData.budgetMax <= 0) {
        throw new Error('El presupuesto máximo debe ser mayor a 0');
    }
    if (projectData.budgetMin > projectData.budgetMax) {
        throw new Error('El presupuesto mínimo no puede ser mayor al máximo');
    }

    // Verificar que el cliente exista en la colección users (opcional, pero recomendable)
    const clientDoc = await db.collection('users').doc(projectData.clientUid).get();
    if (!clientDoc.exists) {
        throw new Error(`El cliente con UID ${projectData.clientUid} no existe`);
    }

    // Preparar datos para guardar
    const newProject: Omit<IProject, 'id'> = {
        clientUid: projectData.clientUid,
        clientName: projectData.clientName,
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        requiredSkills: projectData.requiredSkills || [],
        budgetMin: projectData.budgetMin,
        budgetMax: projectData.budgetMax,
        paymentType: projectData.paymentType,
        maxDevelopersNeeded: projectData.maxDevelopersNeeded || 1,
        currentApplicantsCount: 0, // Siempre inicia en 0
        status: projectData.status || 'open',
        createdAt: Timestamp.now(),
        recommendedRoles: projectData.recommendedRoles || [],
        deadline: projectData.deadline ?? undefined,
    };

    const docRef = await db.collection('projects').add(newProject);
    const createdDoc = await docRef.get();
    return {
        id: docRef.id,
        ...createdDoc.data(),
    } as IProject & { id: string };
};

// Actualizar un proyecto (solo el dueño puede hacerlo, pero la autorización va en el controlador/middleware)
export const updateProject = async (
    projectId: string,
    updates: Partial<Omit<IProject, 'clientUid' | 'createdAt' | 'currentApplicantsCount'>>
): Promise<IProject & { id: string }> => {
    // Verificar que el proyecto existe
    const existing = await getProjectById(projectId);
    if (!existing) {
        throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    // Validar que no se intente actualizar campos inmutables
    if ('clientUid' in updates && updates.clientUid !== undefined) {
        throw new Error('No se puede cambiar el UID del cliente');
    }
    if ('createdAt' in updates && updates.createdAt !== undefined) {
        throw new Error('No se puede cambiar la fecha de creación');
    }
    if ('currentApplicantsCount' in updates && updates.currentApplicantsCount !== undefined) {
        throw new Error('No se puede modificar el contador de postulaciones manualmente');
    }

    // Validar presupuesto si se actualiza
    if (updates.budgetMin !== undefined) {
        if (updates.budgetMin <= 0) {
            throw new Error('El presupuesto mínimo debe ser mayor a 0');
        }
        if (updates.budgetMax !== undefined && updates.budgetMin > updates.budgetMax) {
            throw new Error('El presupuesto mínimo no puede ser mayor al máximo');
        }
    }
    if (updates.budgetMax !== undefined) {
        if (updates.budgetMax <= 0) {
            throw new Error('El presupuesto máximo debe ser mayor a 0');
        }
        if (updates.budgetMin !== undefined && updates.budgetMin > updates.budgetMax) {
            throw new Error('El presupuesto mínimo no puede ser mayor al máximo');
        }
    }

    // Preparar datos para actualizar (limpiar undefined)
    const updateData: any = { ...updates };
    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) delete updateData[key];
    });

    await db.collection('projects').doc(projectId).update(updateData);

    // Retornar proyecto actualizado
    const updated = await getProjectById(projectId);
    return updated!;
};

// Eliminar un proyecto (solo el dueño o admin)
export const deleteProject = async (projectId: string): Promise<void> => {
    const existing = await getProjectById(projectId);
    if (!existing) {
        throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }
    await db.collection('projects').doc(projectId).delete();
};

// Incrementar el contador de postulaciones (usado al recibir una nueva aplicación)
export const incrementApplicantsCount = async (projectId: string): Promise<void> => {
    const projectRef = db.collection('projects').doc(projectId);
    await projectRef.update({
        currentApplicantsCount: FieldValue.increment(1),
    });
};