const API_URL = 'http://localhost:3000/api';

// Función para obtener el token actual de Firebase
const getToken = async (): Promise<string | null> => {
  const { auth } = await import('../config/firebaseClient');
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// Función genérica para peticiones autenticadas
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await getToken();
  if (!token) throw new Error('No hay token de autenticación');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Funciones específicas para autenticación
export const registerUser = async (userData: {
  email: string;
  password: string;
  displayName?: string;
  role: string;
}) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const loginUser = async (email: string, password: string) => {
  // Nota: El login se hace con Firebase Auth directamente en el frontend.
  // Esta función solo verifica que el usuario existe en Firestore.
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const getUserProfile = async () => {
  return authenticatedFetch('/auth/me');
};