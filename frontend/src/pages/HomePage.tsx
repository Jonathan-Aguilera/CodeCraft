import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const HomePage = () => {
  // Estado para el test de conexión
  const [dbStatus, setDbStatus] = useState<string>('Cargando...');
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const healthRes = await fetch('http://localhost:3000/api/health');
        if (!healthRes.ok) throw new Error('Backend no responde');
        console.log('✅ Backend activo');

        const dbRes = await fetch('http://localhost:3000/api/test-db');
        const result = await dbRes.json();
        console.log('📦 Respuesta de Firestore:', result);

        if (result.success) {
          setDbStatus('✅ Conexión a Firestore exitosa');
          setDbData(result.data);
        } else {
          setDbStatus('❌ Error en Firestore: ' + result.message);
        }
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
        setDbStatus('❌ No se pudo conectar con el backend');
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Hero Section */}
      <h1 className="text-4xl font-bold text-white md:text-6xl">
        Bienvenido a <span className="text-emerald-500">CodeCraft</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-400">
        Conecta con el mejor talento tecnológico o encuentra el proyecto ideal para tus habilidades.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/developers">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Explorar Talentos
          </Button>
        </Link>
        <Link to="/projects">
          <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Ver Proyectos
          </Button>
        </Link>
      </div>

      {/* Tarjetas de características */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-[#1E1E1E] p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white">🚀 Para Desarrolladores</h3>
          <p className="mt-2 text-sm text-gray-400">Encuentra proyectos que se ajusten a tus habilidades y haz crecer tu portafolio.</p>
        </div>
        <div className="rounded-lg bg-[#1E1E1E] p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white">💼 Para Clientes</h3>
          <p className="mt-2 text-sm text-gray-400">Publica tus proyectos y conecta con los mejores desarrolladores.</p>
        </div>
        <div className="rounded-lg bg-[#1E1E1E] p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white">⭐ Comunidad</h3>
          <p className="mt-2 text-sm text-gray-400">Comparte conocimientos, recibe reseñas y construye tu reputación.</p>
        </div>
      </div>

      {/* Test de conexión al backend (manteniendo el diseño que ya tenías) */}
      <div className="mt-16 w-full max-w-md">
        <div className="rounded-lg bg-[#1E1E1E] p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-2">🔌 Estado de la conexión:</h2>
          <p className="text-gray-400">{dbStatus}</p>
          {dbData && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-500">Datos de prueba desde Firestore:</p>
              <pre className="bg-[#0D0D0D] p-2 rounded text-xs mt-1 overflow-auto text-gray-300">
                {JSON.stringify(dbData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};