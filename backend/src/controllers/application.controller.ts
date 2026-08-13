import { Request, Response } from 'express';
import * as applicationService from '../services/application.service';

// Obtener aplicaciones de un proyecto
export const getApplicationsByProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const applications = await applicationService.getApplicationsByProject(projectId);
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener aplicaciones',
      error: error.message,
    });
  }
};

// Obtener aplicaciones de un desarrollador
export const getApplicationsByDeveloper = async (req: Request, res: Response) => {
  try {
    const developerUid = req.params.developerUid as string;
    const applications = await applicationService.getApplicationsByDeveloper(developerUid);
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener aplicaciones del desarrollador',
      error: error.message,
    });
  }
};

// Obtener una aplicación por ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id as string;
    const application = await applicationService.getApplicationById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplicación no encontrada',
      });
    }
    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener aplicación',
      error: error.message,
    });
  }
};

// Crear una nueva postulación
export const createApplication = async (req: Request, res: Response) => {
  try {
    const applicationData = req.body;
    // Nota: En el futuro, developerUid se extraerá del token (req.user.uid)
    // Por ahora, lo tomamos del body
    const newApplication = await applicationService.createApplication(applicationData);
    return res.status(201).json({
      success: true,
      message: 'Postulación creada exitosamente',
      application: newApplication,
    });
  } catch (error: any) {
    // Manejar errores de negocio específicos
    if (
      error.message.includes('obligatorio') ||
      error.message.includes('no existe') ||
      error.message.includes('no está abierto') ||
      error.message.includes('propio proyecto') ||
      error.message.includes('permisos') ||
      error.message.includes('Ya has postulado')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al crear postulación',
      error: error.message,
    });
  }
};

// Actualizar estado de una postulación (aceptar/rechazar)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id as string;
    const { status } = req.body;
    // En el futuro, clientUid se extraerá del token (req.user.uid)
    // Por ahora, lo tomamos del body
    const { clientUid } = req.body;

    if (!clientUid) {
      return res.status(400).json({
        success: false,
        message: 'El UID del cliente es obligatorio',
      });
    }

    const updated = await applicationService.updateApplicationStatus(applicationId, status, clientUid);
    return res.status(200).json({
      success: true,
      message: `Postulación ${status === 'accepted' ? 'aceptada' : 'rechazada'} exitosamente`,
      application: updated,
    });
  } catch (error: any) {
    if (
      error.message.includes('no encontrada') ||
      error.message.includes('permisos') ||
      error.message.includes('máximo') ||
      error.message.includes('estado')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar estado de la postulación',
      error: error.message,
    });
  }
};

// Eliminar una postulación
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id as string;
    const { requesterUid } = req.body;
    if (!requesterUid) {
      return res.status(400).json({
        success: false,
        message: 'El UID del solicitante es obligatorio',
      });
    }
    await applicationService.deleteApplication(applicationId, requesterUid);
    return res.status(200).json({
      success: true,
      message: 'Postulación eliminada exitosamente',
    });
  } catch (error: any) {
    if (error.message.includes('no encontrada') || error.message.includes('permisos')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar postulación',
      error: error.message,
    });
  }
};