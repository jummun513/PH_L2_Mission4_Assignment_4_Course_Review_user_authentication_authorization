import express from 'express';
import { courseControllers } from './course.controller';

const router = express.Router();

// call controller
router.get('/best', courseControllers.getBestCourse);

export const courseRoutes = router;
