import { Router } from 'express';
    const router= Router();
// apiRoutes.js
import { parseRecipe, saveRecipe, getRecipes, processWithAnthropic } from '../controllers/recipeController.js';

console.log('apiRoutes.js loaded')
router.post('/parse-recipe', parseRecipe);
router.post('/save-recipe', saveRecipe);
router.get('/get-recipes/:userID', getRecipes);

export default router;