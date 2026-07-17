import { Router } from 'express';
import { scrapeJobs } from '../controllers/jobsController';

const router = Router();

router.get('/scrape', scrapeJobs);

export default router;
