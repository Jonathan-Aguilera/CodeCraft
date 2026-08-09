import { Router } from 'express';
import { testDatabaseConnection, healthCheck } from '../controllers/testController';

const router = Router();

router.get('/health', healthCheck);
router.get('/test-db', testDatabaseConnection);

export default router;