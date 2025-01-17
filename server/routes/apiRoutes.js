const express=require('express');
const router=express.Router();
const recipeController=require('../controllers/recipeController');

console.log('apiRoutes.js loaded')
router.post('/parse-recipe', recipeController.parseRecipe);
router.post('/save-recipe', recipeController.saveRecipe);
router.get('/get-recipes/:userID', recipeController.getRecipes);

module.exports=router;