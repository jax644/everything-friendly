import { Router } from "express";
const router = Router();
// apiRoutes.js
import {
  parseRecipe,
  saveRecipe,
  getRecipes,
  getRecipeById,
  processWithAnthropic,
} from "../controllers/recipeController.js";

console.log("apiRoutes.js loaded");
router.post("/parse-recipe", parseRecipe);
router.post("/save-recipe", saveRecipe);
router.get("/get-recipes/:userID", getRecipes);
router.get("/recipe/:id", getRecipeById);

export default router;
