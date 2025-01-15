const express=require('express');
const router=express.Router();
const homeController=require('../controllers/homeController');

console.log('homeRoutes.js loaded')

router.get('/', homeController.renderHomePage);

module.exports = router;