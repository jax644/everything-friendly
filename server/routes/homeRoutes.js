import { Router } from 'express';
    const router= Router();
import { renderHomePage } from '../controllers/homeController.js';

console.log('homeRoutes.js loaded')

router.get('/', renderHomePage);

export default router;