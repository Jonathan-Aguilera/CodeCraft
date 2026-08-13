import { Request, Response } from 'express';
import * as developerProfileService from '../services/developerProfile.service';

// Obtener lista de perfiles (con filtros)
export const getDeveloperProfiles = async (req: Request, res: Response) => {
  try {
    const { skills, availability, minRate, maxRate, minRating } = req.query;
    const filters: any = {};
    if (skills) filters.skills = (skills as string).split(',');
    if (availability) filters.availability = availability as string;
    if (minRate) filters.minRate = Number(minRate);
    if (maxRate) filters.maxRate = Number(maxRate);
    if (minRating) filters.minRating = Number(minRating);

    const profiles = await developerProfileService.getDeveloperProfiles(filters);
    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener perfiles',
      error: error.message,
    });
  }
};

// Obtener un perfil por UID
export const getProfileByUid = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;
    const profile = await developerProfileService.getProfileByUid(uid);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado',
      });
    }
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message,
    });
  }
};

// Crear un perfil de desarrollador
export const createDeveloperProfile = async (req: Request, res: Response) => {
  try {
    const profileData = req.body;
    const newProfile = await developerProfileService.createDeveloperProfile(profileData);
    return res.status(201).json({
      success: true,
      message: 'Perfil de desarrollador creado exitosamente',
      profile: newProfile,
    });
  } catch (error: any) {
    if (error.message.includes('obligatorio') || error.message.includes('ya existe') || error.message.includes('rol')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al crear perfil',
      error: error.message,
    });
  }
};

// Actualizar un perfil
export const updateDeveloperProfile = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;
    const updates = req.body;
    // Autorización: el usuario autenticado debe ser el dueño del perfil (o admin)
    // Esto se verificará con el authMiddleware en el futuro.
    const updatedProfile = await developerProfileService.updateDeveloperProfile(uid, updates);
    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      profile: updatedProfile,
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
      message: 'Error al actualizar perfil',
      error: error.message,
    });
  }
};

// Eliminar un perfil
export const deleteDeveloperProfile = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;
    await developerProfileService.deleteDeveloperProfile(uid);
    return res.status(200).json({
      success: true,
      message: 'Perfil eliminado exitosamente',
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
      message: 'Error al eliminar perfil',
      error: error.message,
    });
  }
};