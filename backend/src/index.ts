import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from './routes/testRoutes'; // <-- Importación correcta

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de prueba (montadas en /api)
app.use('/api', testRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('CodeCraft Backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});