import { api } from './api';
import type { ILoginCredentials, IRegisterCredentials, IAuthPayload, IApiResponse } from '../types';

export const authService = {
  // Login con Firebase (el backend no maneja login directamente, pero podemos verificar)
  login: (credentials: ILoginCredentials) =>
    api.post<IApiResponse<{ user: IAuthPayload }>>('/auth/login', credentials),

  // Registro (crea usuario en Firebase Auth y en Firestore)
  register: (data: IRegisterCredentials) =>
    api.post<IApiResponse<{ user: IAuthPayload }>>('/auth/register', data),

  // Obtener perfil del usuario autenticado
  getProfile: () =>
    api.get<IApiResponse<{ user: IAuthPayload }>>('/auth/me'),

  // Cerrar sesión (solo limpieza local, no hay endpoint en el backend)
  logout: () => {
    localStorage.removeItem('authToken');
    // Aquí también podrías cerrar sesión en Firebase Auth
  },
};