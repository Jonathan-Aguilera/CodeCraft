import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function App() {
  const [dbStatus, setDbStatus] = useState<string>('Cargando...');
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        // 1. Primero verificar que el backend está vivo
        const healthRes = await fetch('http://localhost:3000/api/health');
        if (!healthRes.ok) throw new Error('Backend no responde');
        console.log('✅ Backend activo');

        // 2. Probar la conexión a Firestore
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-4xl font-bold text-blue-600">
        ⚛️ CodeCraft Frontend
      </h1>
      <Button variant="default">¡Hola, shadcn!</Button>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">Estado de la conexión:</h2>
        <p className="text-gray-700">{dbStatus}</p>
        {dbData && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-500">Datos de prueba desde Firestore:</p>
            <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto">
              {JSON.stringify(dbData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;