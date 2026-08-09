import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const testDatabaseConnection = async (req: Request, res: Response) => {
  try {
    console.log('🔄 Iniciando prueba de conexión a Firestore...');

    const testDocRef = db.collection('ejemplo').doc('prueba-id');
    await testDocRef.set({
      nombre: 'Conexión exitosa desde el backend',
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Documento creado/actualizado en Firestore');

    const docSnapshot = await testDocRef.get();
    if (!docSnapshot.exists) {
      throw new Error('El documento no existe después de crearlo');
    }
    const data = docSnapshot.data();
    console.log('📄 Datos leídos:', data);

    res.status(200).json({
      success: true,
      message: 'Conexión a Firestore exitosa',
      data: data,
    });
  } catch (error) {
    console.error('❌ Error en prueba de BD:', error);
    res.status(500).json({
      success: false,
      message: 'Error al conectar con Firestore',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando' });
};