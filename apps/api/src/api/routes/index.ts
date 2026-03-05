import { Router } from 'express';
import { jobsController } from '../controllers/jobs.controller';
import { resumeController } from '../controllers/resume.controller';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
    res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Jobs ─────────────────────────────────────────────────────────────────────
router.get('/jobs', jobsController.getJobs);
router.get('/jobs/ranked', jobsController.getRankedJobs);
router.get('/jobs/analytics', jobsController.getAnalytics);
router.get('/jobs/:id', jobsController.getJobById);
router.get('/jobs/:id/analysis', jobsController.getJobAnalysis);
router.post('/jobs/:id/analyze', jobsController.triggerAnalysis);
router.post('/jobs/:id/cold-email', jobsController.generateColdEmail);
router.post('/jobs/refresh', jobsController.refreshJobs);

// ─── Resume ───────────────────────────────────────────────────────────────────
router.post('/resume/upload', uploadMiddleware.single('resume'), resumeController.uploadResume);
router.get('/resume/active', resumeController.getActiveResume);
router.delete('/resume/:id', resumeController.deleteResume);

export default router;
