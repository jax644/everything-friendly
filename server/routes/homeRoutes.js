const express=require('express');
const router=express.Router();
const homeController=require('../controllers/homeController');

console.log('homeRoutes.js loaded')

router.get('/', homeController.renderHomePage);
router.get('/dashboard', homeController.renderDashboardPage);

module.exports = router;