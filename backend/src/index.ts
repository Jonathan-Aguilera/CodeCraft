import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from './routes/testRoutes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', testRoutes);          // Rutas de prueba (health, test-db)
app.use('/api/users', userRoutes);    // <-- Rutas de usuarios
app.use('/api/projects', projectRoutes); // <-- Rutas de proyectos
app.get('/', (req, res) => {
  res.send('CodeCraft Backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});