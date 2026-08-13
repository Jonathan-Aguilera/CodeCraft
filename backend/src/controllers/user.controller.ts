import { Request, Response } from 'express';
import * as userService from '../services/user.service';

// 1. Verificar si existe un usuario por email (devuelve true/false)
export const checkUserExists = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido y debe ser texto',
      });
    }
    const exists = await userService.userExistsByEmail(email);
    return res.status(200).json({
      success: true,
      exists,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar usuario',
      error: error.message,
    });
  }
};

// 2. Obtener usuario por UID (desde parámetro de ruta)
export const getUserByUid = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params as { uid: string };
    const user = await userService.getUserByUid(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message,
    });
  }
};

// 3. Obtener usuario por email (desde query)
export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido y debe ser texto',
      });
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuario por email',
      error: error.message,
    });
  }
};

// 4. Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    return res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: newUser,
    });
  } catch (error: any) {
    // Capturar errores de negocio (email duplicado, rol inválido)
    if (error.message.includes('ya está registrado') || error.message.includes('No se pueden crear usuarios con rol admin')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message,
    });
  }
};

// 5. Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;  // ✅ Afirmación de tipo
    const updates = req.body;
    const updatedUser = await userService.updateUser(uid, updates);
    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser,
    });
  } catch (error: any) {
    if (error.message.includes('no encontrado') || error.message.includes('No se puede asignar el rol admin')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message,
    });
  }
};

// 6. Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;  // ✅ Afirmación de tipo
    await userService.deleteUser(uid);
    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente',
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
      message: 'Error al eliminar usuario',
      error: error.message,
    });
  }
};