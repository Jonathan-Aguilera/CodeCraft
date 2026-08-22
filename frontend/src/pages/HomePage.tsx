import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const HomePage = () => {
  const [connectionStatus, setConnectionStatus] = useState('Verificando conexión...');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
          setConnectionStatus('✅ Conexión con el backend establecida');
          setIsConnected(true);
        } else {
          setConnectionStatus('❌ El backend responde con error');
          setIsConnected(false);
        }
      } catch (error) {
        setConnectionStatus('❌ No se pudo conectar con el backend');
        setIsConnected(false);
      }
    };
    checkBackendHealth();
  }, []);

  return (
    <div
      style={{
        background: 'linear-gradient(to top left, #4A90B8 0%, #6BB5D3 50%, #A8D8EA 100%)',
        minHeight: '100vh',
      }}
      className="relative overflow-hidden px-4 py-6 md:px-8"
    >
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"></div>

      {/* DIV VERDE PRINCIPAL */}
      <div className="relative mx-auto max-w-3xl rounded-3xl bg-[#1E3A2C] p-4 shadow-2xl shadow-sky-900/40 md:p-8">
        
        {/* DIV INTERNO (Fondo más claro, agrupa las secciones) */}
        <div className="div-interno">
          
          {/* SECCIÓN 1: HERO */}
          <section className="text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-md md:text-5xl">
              Bienvenido a <br />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                CodeCraft
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100/90 md:text-xl">
              Conectamos el talento tecnológico con las oportunidades que impulsan el futuro.
            </p>

            {/* Botones con estilo profesional */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/developers">
                <Button className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                  Explorar Talentos
                </Button>
              </Link>
              <Link to="/projects">
                <Button className="rounded-lg border-2 border-amber-500 bg-transparent px-6 py-3 text-amber-200 font-semibold hover:bg-amber-500/20 transition-all duration-300 hover:scale-105">
                  Ver Proyectos
                </Button>
              </Link>
            </div>
          </section>

          {/* Separador visual */}
          <hr className="my-8 border-emerald-700/50" />

          {/* SECCIÓN 2: BENEFICIOS */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold text-emerald-100">
              ¿Por qué elegir CodeCraft?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-emerald-200/80 md:text-base">
              Nuestra plataforma está diseñada para crear sinergias duraderas, ofreciendo un espacio seguro y profesional para el desarrollo de proyectos innovadores.
            </p>

            {/* Tarjetas en grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-300 bg-emerald-100 p-5 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-black">🚀 Desarrolladores</h3>
                <p className="mt-2 text-sm text-black/80">
                  Encuentra proyectos que se alineen con tu stack y pasión.
                </p>
              </div>

              <div className="rounded-xl border border-amber-300 bg-amber-100 p-5 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-black">💼 Clientes</h3>
                <p className="mt-2 text-sm text-black/80">
                  Publica tus ideas y conecta con profesionales capacitados.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-300 bg-emerald-100 p-5 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-black">⭐ Comunidad</h3>
                <p className="mt-2 text-sm text-black/80">
                  Comparte experiencias y construye una reputación sólida.
                </p>
              </div>
            </div>
          </section>

          {/* Separador visual */}
          <hr className="my-8 border-emerald-700/50" />

          {/* SECCIÓN 3: ESTADO DE CONEXIÓN */}
          <section className="text-center">
            <div className="mx-auto max-w-md rounded-xl border border-sky-700/50 bg-sky-950/30 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">🔌 Estado de la conexión:</h2>
              <p className={`mt-2 text-sm font-medium ${isConnected ? 'text-emerald-300' : 'text-red-400'}`}>
                {connectionStatus}
              </p>
              {!isConnected && isConnected !== null && (
                <p className="mt-2 text-xs text-sky-200/70">
                  Asegúrate de que el backend esté corriendo en{' '}
                  <code className="rounded bg-black/30 px-1 py-0.5 font-mono text-amber-200">http://localhost:3000</code>
                </p>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};