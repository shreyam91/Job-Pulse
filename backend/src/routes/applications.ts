import { Router } from 'express';
import { getApplications, updateApplicationStatus } from '../controllers/applicationsController';

const router = Router();

// GET /api/applications
router.get('/', getApplications);

// PATCH /api/applications/:id
router.patch('/:id', updateApplicationStatus);

export default router;
