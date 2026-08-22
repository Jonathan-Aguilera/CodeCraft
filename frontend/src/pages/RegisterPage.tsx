import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaArrowLeft, FaTree, FaUserPlus } from 'react-icons/fa';

// --- Esquema de validación ---
const registerSchema = z.object({
  displayName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre no puede contener números')
    .max(50, 'El nombre es demasiado largo'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['developer', 'client', 'both'], {
    errorMap: () => ({ message: 'Selecciona un rol válido' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  const onSubmit = (data: RegisterFormData) => {
    setIsSubmitting(true);
    console.log('Datos del formulario:', data);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('¡Registro simulado! (Conecta con el backend para persistir)');
    }, 1500);
  };

  const roleOptions = [
    { value: '', label: '-- Selecciona un rol --' },
    { value: 'developer', label: '🌱 Desarrollador' },
    { value: 'client', label: '🌳 Cliente' },
    { value: 'both', label: '🌲 Ambos (Desarrollador y Cliente)' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-cyan-900 px-4 py-12">
      {/* Elementos decorativos (claros de luz entre árboles) */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"></div>
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-2xl"></div>

      {/* Contenedor centrado para la tarjeta */}
      <div className="relative mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full">
          {/* Tarjeta con glassmorphism */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/5 backdrop-blur-md shadow-2xl shadow-emerald-900/40">
            {/* Línea decorativa superior (tronco/madera) */}
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-700/60 to-transparent"></div>

            <div className="p-6 sm:p-8">
              {/* Encabezado */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <FaTree className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
                  <p className="text-sm text-emerald-300/70">Únete al bosque de CodeCraft</p>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Nombre */}
                <div>
                  <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-gray-200">
                    Nombre de usuario <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    className={`w-full rounded-lg border bg-black/20 px-4 py-3 text-white placeholder:text-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                      errors.displayName ? 'border-red-400' : 'border-emerald-400/30'
                    }`}
                    {...register('displayName')}
                  />
                  {errors.displayName && (
                    <p className="mt-1.5 text-xs text-red-300">{errors.displayName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-200">
                    Correo electrónico <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className={`w-full rounded-lg border bg-black/20 px-4 py-3 text-white placeholder:text-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                      errors.email ? 'border-red-400' : 'border-emerald-400/30'
                    }`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-300">{errors.email.message}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-200">
                    Contraseña <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full rounded-lg border bg-black/20 px-4 py-3 text-white placeholder:text-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                      errors.password ? 'border-red-400' : 'border-emerald-400/30'
                    }`}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-300">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-200">
                    Confirmar contraseña <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    className={`w-full rounded-lg border bg-black/20 px-4 py-3 text-white placeholder:text-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                      errors.confirmPassword ? 'border-red-400' : 'border-emerald-400/30'
                    }`}
                    {...register('confirmPassword')}
                  />
                  {confirmPassword && !errors.confirmPassword && (
                    <p className={`mt-1.5 text-xs ${doPasswordsMatch ? 'text-emerald-300' : 'text-red-300'}`}>
                      {doPasswordsMatch ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden'}
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-300">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Rol */}
                <div>
                  <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-200">
                    Rol <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    id="role"
                    className={`w-full rounded-lg border bg-black/20 px-4 py-3 text-white backdrop-blur-sm transition-all duration-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                      errors.role ? 'border-red-400' : 'border-emerald-400/30'
                    }`}
                    {...register('role')}
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-emerald-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="mt-1.5 text-xs text-red-300">{errors.role.message}</p>
                  )}
                </div>

                {/* Botón de registro */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-600/40 disabled:opacity-70 disabled:hover:scale-100"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="h-5 w-5" />
                        Registrarse
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Enlace a login */}
              <div className="mt-6 text-center text-sm text-gray-300">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </div>

              {/* Botón volver a Home */}
              <div className="mt-4 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 px-5 py-2.5 text-sm text-emerald-300 transition-all duration-200 hover:bg-emerald-400/10 hover:text-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <FaArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>

          {/* Mensaje decorativo al pie */}
          <p className="mt-6 text-center text-xs text-emerald-300/40">
            🌳 Al registrarte, aceptas cuidar este bosque de talento.
          </p>
        </div>
      </div>
    </div>
  );
};