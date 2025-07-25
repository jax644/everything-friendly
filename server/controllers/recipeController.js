import puppeteer from "puppeteer";
import RecipeClipper from "@julianpoy/recipe-clipper";
import jsdom from "jsdom";
import sanitizeHtml from "sanitize-html";
import axios from "axios";
import Anthropic from "@anthropic-ai/sdk";
import { isValidUrl, clipRecipeFromUrl } from "../utils.js";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function parseRecipe(req, res) {
  console.log("recipeController.parseRecipe called");
  // Retrieve and validate the input URL
  const { url, preferences } = req.body;
  console.log(req.body);

  if (!url || !preferences) {
    return res.status(404).json({ error: "URL and preferences are required" });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    // Scrape the recipe
    const rawRecipeData = await clipRecipeFromUrl(url);
    console.log("rawRecipeData:");
    console.log(rawRecipeData);

    let recipeDataJson = JSON.stringify(rawRecipeData);
    console.log(`recipeDataJson: ${recipeDataJson}`);

    // Process recipe with Anthropic
    const modifiedRecipe = await processWithAnthropic(
      recipeDataJson,
      preferences
    );
    console.log("modifiedRecipe:");
    console.log(modifiedRecipe);

    // Respond with processed recipe data as JSON
    res.json({ reply: modifiedRecipe });
  } catch (error) {
    console.error("Error in POST handlers:", error);
    res.status(500).json({ error: "Error scraping the recipe" });
  }
}

export async function saveRecipe(req, res) {
  console.log("recipeController.saveRecipe called");
  const { userID, recipe, url, preferences } = req.body;

  console.log(req.body);

  if (!userID || !recipe || !url || !preferences) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create new recipe in separate collection
    const newRecipe = new Recipe({
      title: recipe.title,
      imageURL: recipe.imageURL,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      yield: recipe.yield || "",
      activeTime: recipe.activeTime || "",
      totalTime: recipe.totalTime || "",
      url: url,
      preferences: preferences,
      userId: userID,
    });

    await newRecipe.save();
    res.json({ message: "Recipe saved successfully", recipe: newRecipe });
  } catch (error) {
    console.error("Error saving the recipe:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while saving the recipe" });
  }
}

export async function getRecipes(req, res) {
  console.log("recipeController.getRecipes called");
  const userID = req.params.userID;

  if (!userID) {
    return res.status(400).json({ error: "UserID is required" });
  }

  try {
    // Verify user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get recipes from separate collection
    const recipes = await Recipe.find({ userId: userID })
      .sort({ createdAt: -1 })
      .exec();

    res.json({ recipes: recipes });
  } catch (error) {
    console.error("Error getting recipes:", error.message);
    res.status(500).json({ error: "An error occurred while getting recipes" });
  }
}

export async function processWithAnthropic(recipeDataJson, preferences) {
  const prompt =
    'You are a recipe assistant who takes in recipes and return modified versions of those recipes based on the user\'s dietary preferences. Please respond with a modified recipe as JSON data in the same format you received it. For the ingredients and instructions, please format the values as arrays of strings and not with new lines. Do not include anything other than JSON in your response. No preamble, explanations, or text beyond the JSON structure. If you encounter a quote to specify inches, please replace it with the word "inch" or "inches". If any of the recipe fields contain quotes, please remove them. Each ingredient must be clearly listed as a separate string in the ingredients array. Thank you!';
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 2048,
    system: prompt,
    messages: [
      {
        role: "user",
        content: `Please give me a version of ${recipeDataJson} that meets my dietary preferences: ${preferences} - Thank you!`,
      },
    ],
  });
  return response.content[0].text;
}
