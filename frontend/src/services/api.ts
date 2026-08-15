import axios from 'axios';

// URL base de tu backend (ajusta si cambias el puerto)
const API_BASE_URL = 'http://localhost:3000/api';

// 1. Crear instancia de Axios con configuración base
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor para añadir el token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtener token del almacenamiento (localStorage o donde guardes)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor para manejar errores globales (ej. token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido: redirigir al login
      localStorage.removeItem('authToken');
      // Aquí podrías redirigir con React Router, pero lo haremos más adelante
    }
    return Promise.reject(error);
  }
);

// 4. Funciones auxiliares para tipar respuestas (opcional)
export const get = <T>(url: string) => api.get<T>(url);
export const post = <T>(url: string, data: any) => api.post<T>(url, data);
export const put = <T>(url: string, data: any) => api.put<T>(url, data);
export const del = <T>(url: string) => api.delete<T>(url);