import { Request, Response } from 'express';
import * as projectService from '../services/project.service';

// Obtener lista de proyectos (con filtros opcionales)
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { status, skills, minBudget, maxBudget } = req.query;
    const filters: any = {};
    if (status) filters.status = status as string;
    if (skills) filters.skills = (skills as string).split(',');
    if (minBudget) filters.minBudget = Number(minBudget);
    if (maxBudget) filters.maxBudget = Number(maxBudget);

    const projects = await projectService.getProjects(filters);
    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener proyectos',
      error: error.message,
    });
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado',
      });
    }
    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener proyecto',
      error: error.message,
    });
  }
};

// Crear un nuevo proyecto
export const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    // El clientUid debería venir del token (authMiddleware), pero por ahora lo tomamos del body
    // En una fase posterior, se extraerá de req.user.uid
    const newProject = await projectService.createProject(projectData);
    return res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      project: newProject,
    });
  } catch (error: any) {
    if (error.message.includes('obligatorio') || error.message.includes('presupuesto')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al crear proyecto',
      error: error.message,
    });
  }
};

// Actualizar un proyecto
export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const updates = req.body;
    // Aquí debería validarse que el usuario autenticado sea el dueño del proyecto
    const updatedProject = await projectService.updateProject(projectId, updates);
    return res.status(200).json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      project: updatedProject,
    });
  } catch (error: any) {
    if (error.message.includes('no encontrado') || error.message.includes('No se puede')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar proyecto',
      error: error.message,
    });
  }
};

// Eliminar un proyecto
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;
    await projectService.deleteProject(projectId);
    return res.status(200).json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
    });
  } catch (error: any) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar proyecto',
      error: error.message,
    });
  }
};