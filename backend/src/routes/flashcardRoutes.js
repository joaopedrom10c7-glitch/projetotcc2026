import { Router } from 'express';
import {
  listFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from '../controllers/flashcardController.js';

const router = Router();

router.get('/', listFlashcards);
router.get('/:id', getFlashcard);
router.post('/', createFlashcard);
router.patch('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);

export default router;

