import { Router } from 'express';
import { listSessions, createSession } from '../controllers/studySessionController.js';

const router = Router();

router.get('/', listSessions);
router.post('/', createSession);

export default router;

