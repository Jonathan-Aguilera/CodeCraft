import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba (health check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CodeCraft Backend is running!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});