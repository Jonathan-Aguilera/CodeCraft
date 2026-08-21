import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import type { ReactNode } from 'react';
import {
    auth,
    // Asegúrate de que firebaseClient exporte correctamente
} from '@/config/firebaseClient';
import type { User as FirebaseUser } from 'firebase/auth';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updatePassword,
    onAuthStateChanged,
    updateProfile as updateFirebaseProfile,
    sendPasswordResetEmail as firebaseSendResetEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import type { IAuthPayload } from '@/types';

// ---------- HELPER: Traducción de errores de Firebase ----------
const getFirebaseErrorMessage = (code: string): string => {
    const errorMap: Record<string, string> = {
        'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
        'auth/wrong-password': 'La contraseña es incorrecta.',
        'auth/email-already-in-use':
            'Este correo electrónico ya está registrado. Inicia sesión.',
        'auth/invalid-email': 'El correo electrónico no es válido.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/too-many-requests':
            'Demasiados intentos fallidos. Por favor, espera un momento.',
        'auth/requires-recent-login':
            'Esta acción es sensible. Vuelve a iniciar sesión para continuar.',
        'auth/network-request-failed':
            'Error de red. Verifica tu conexión a internet.',
        'auth/popup-closed-by-user':
            'El proceso de autenticación fue cancelado. Intenta de nuevo.',
    };
    return errorMap[code] || 'Ocurrió un error inesperado. Intenta de nuevo.';
};

// ---------- TIPOS DEL CONTEXTO ----------
interface AuthContextType {
    user: IAuthPayload | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        displayName: string,
        role: 'developer' | 'client' | 'both'
    ) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => IAuthPayload | null;
    updateProfile: (data: Partial<IAuthPayload>) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    sendPasswordResetEmail: (email: string) => Promise<void>;
    reloadUser: () => Promise<void>;
}

// ---------- CONTEXTO ----------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- PROVIDER ----------
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<IAuthPayload | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Efecto: Sincronización con Firebase Auth ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser: FirebaseUser | null) => {
                if (firebaseUser) {
                    try {
                        const token = await firebaseUser.getIdToken();
                        localStorage.setItem('authToken', token);

                        const response = await authService.getProfile();
                        if (response.data.success && response.data.data?.user) {
                            setUser(response.data.data.user);
                        } else {
                            // El usuario existe en Firebase pero no en Firestore -> limpieza
                            await signOut(auth);
                            localStorage.removeItem('authToken');
                            setUser(null);
                        }
                    } catch (error) {
                        console.error('Error al cargar perfil:', error);
                        await signOut(auth);
                        localStorage.removeItem('authToken');
                        setUser(null);
                    }
                } else {
                    localStorage.removeItem('authToken');
                    setUser(null);
                }
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    // --- Login ---
    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const firebaseUser = userCredential.user;
            const token = await firebaseUser.getIdToken();
            localStorage.setItem('authToken', token);

            const response = await authService.getProfile();
            if (response.data.success && response.data.data?.user) {
                setUser(response.data.data.user);
            } else {
                throw new Error('No se pudo obtener el perfil del usuario.');
            }
        } catch (error: any) {
            console.error('Error en login:', error);
            localStorage.removeItem('authToken');
            setUser(null);
            // Lanzamos un error traducido para que el componente lo maneje
            throw new Error(getFirebaseErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Registro ---
    const register = useCallback(
        async (
            email: string,
            password: string,
            displayName: string,
            role: 'developer' | 'client' | 'both'
        ) => {
            setLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const firebaseUser = userCredential.user;

                // Actualizar displayName en Firebase Auth
                await updateFirebaseProfile(firebaseUser, { displayName });

                // Registrar en Firestore (backend)
                const response = await authService.register({
                    email,
                    password,
                    displayName,
                    role,
                });

                if (!response.data.success) {
                    throw new Error(
                        response.data.message || 'Error al registrar usuario.'
                    );
                }

                // NOTA: Decidimos NO iniciar sesión automáticamente para que el usuario
                // confirme sus datos antes de entrar. Si prefieres auto-login,
                // descomenta las líneas de abajo.
                /*
                const token = await firebaseUser.getIdToken();
                localStorage.setItem('authToken', token);
                const profileResponse = await authService.getProfile();
                if (profileResponse.data.success && profileResponse.data.data?.user) {
                  setUser(profileResponse.data.data.user);
                }
                */
            } catch (error: any) {
                console.error('Error en registro:', error);
                throw new Error(getFirebaseErrorMessage(error.code));
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // --- Logout ---
    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('authToken');
            setUser(null);
        } catch (error: any) {
            console.error('Error en logout:', error);
            throw new Error(
                getFirebaseErrorMessage(error.code) || 'Error al cerrar sesión.'
            );
        }
    }, []);

    // --- Obtener usuario actual (sincrónico) ---
    const getCurrentUser = useCallback((): IAuthPayload | null => {
        return user;
    }, [user]);

    // --- Actualizar perfil ---
    const updateProfile = useCallback(
        async (data: Partial<IAuthPayload>) => {
            if (!user) throw new Error('Usuario no autenticado.');
            setLoading(true);
            try {
                // 1. Actualizar en Firebase Auth (solo displayName y photoURL)
                if (auth.currentUser) {
                    const firebaseUpdate: { displayName?: string; photoURL?: string } = {};
                    if (data.displayName) firebaseUpdate.displayName = data.displayName;
                    if (data.photoURL) firebaseUpdate.photoURL = data.photoURL;
                    if (Object.keys(firebaseUpdate).length > 0) {
                        await updateFirebaseProfile(auth.currentUser, firebaseUpdate);
                    }
                }

                // 2. Actualizar en Firestore (backed)
                // Nota: El backend solo acepta campos que existan en IUser.
                // Si data contiene campos extra (ej. realName), el backend los ignorará.
                await userService.updateUser(user.uid, data);

                // 3. Actualizar estado local
                setUser((prev) => (prev ? { ...prev, ...data } : null));
            } catch (error: any) {
                console.error('Error al actualizar perfil:', error);
                throw new Error(
                    getFirebaseErrorMessage(error.code) || 'Error al actualizar perfil.'
                );
            } finally {
                setLoading(false);
            }
        },
        [user]
    );

    // --- Cambiar contraseña (CON REAUTENTICACIÓN) ---
    const changePassword = useCallback(
        async (oldPassword: string, newPassword: string) => {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) {
                throw new Error('Usuario no autenticado o sin email.');
            }

            try {
                // 1. Reautenticar al usuario (OBLIGATORIO para seguridad)
                const credential = EmailAuthProvider.credential(
                    currentUser.email,
                    oldPassword
                );
                await reauthenticateWithCredential(currentUser, credential);

                // 2. Actualizar la contraseña
                await updatePassword(currentUser, newPassword);
            } catch (error: any) {
                console.error('Error al cambiar contraseña:', error);
                throw new Error(
                    getFirebaseErrorMessage(error.code) ||
                    'Error al cambiar la contraseña. Verifica tu contraseña actual.'
                );
            }
        },
        []
    );

    // --- Enviar correo de restablecimiento ---
    const sendPasswordResetEmail = useCallback(async (email: string) => {
        try {
            await firebaseSendResetEmail(auth, email);
        } catch (error: any) {
            console.error('Error al enviar correo:', error);
            throw new Error(
                getFirebaseErrorMessage(error.code) ||
                'Error al enviar el correo de restablecimiento.'
            );
        }
    }, []);

    // --- Recargar perfil desde el backend ---
    const reloadUser = useCallback(async () => {
        if (!user) return;
        try {
            const response = await authService.getProfile();
            if (response.data.success && response.data.data?.user) {
                setUser(response.data.data.user);
            }
        } catch (error: any) {
            console.error('Error al recargar perfil:', error);
            throw new Error(
                getFirebaseErrorMessage(error.code) || 'Error al recargar perfil.'
            );
        }
    }, [user]);

    // --- Memoizar el valor del contexto para evitar renders innecesarios ---
    const value = useMemo<AuthContextType>(
        () => ({
            user,
            loading,
            login,
            register,
            logout,
            getCurrentUser,
            updateProfile,
            changePassword,
            sendPasswordResetEmail,
            reloadUser,
        }),
        [
            user,
            loading,
            login,
            register,
            logout,
            getCurrentUser,
            updateProfile,
            changePassword,
            sendPasswordResetEmail,
            reloadUser,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Hook personalizado para consumir el contexto ---
export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};