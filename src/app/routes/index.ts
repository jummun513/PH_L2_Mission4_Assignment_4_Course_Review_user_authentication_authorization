import { Router } from 'express';
import { categoryRoutes } from '../modules/category/category.route';
import { courseRoutes } from '../modules/course/course.route';
import { coursesRoutes } from '../modules/courses/courses.route';
import { reviewRoutes } from '../modules/reviews/review.route';
import { authRoutes } from '../modules/auth/auth.route';

const router = Router();

const modulesRoutes = [
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/course',
    route: courseRoutes,
  },
  {
    path: '/courses',
    route: coursesRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];

modulesRoutes.forEach(e => router.use(e.path, e.route));

export default router;
