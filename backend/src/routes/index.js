import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import flashcardRoutes from './flashcardRoutes.js';
import studySessionRoutes from './studySessionRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.use(healthRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/study-sessions', studySessionRoutes);
router.use('/sessions', studySessionRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

