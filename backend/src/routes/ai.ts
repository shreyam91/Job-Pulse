import { Router } from 'express';
import { generateCoverLetter, optimizeResume } from '../controllers/aiController';

const router = Router();

// POST /api/ai/cover-letter
router.post('/cover-letter', generateCoverLetter);

// POST /api/ai/optimize-resume
router.post('/optimize-resume', optimizeResume);

export default router;
