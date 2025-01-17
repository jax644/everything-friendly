
const puppeteer = require('puppeteer');
const RecipeClipper = require('@julianpoy/recipe-clipper');
const jsdom =  require("jsdom");
const sanitizeHtml = require("sanitize-html");
const axios = require('axios')
const Anthropic = require("@anthropic-ai/sdk")
const { isValidUrl, clipRecipeFromUrl } = require('../utils');
const User = require('../models/User');

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
})

exports.parseRecipe = async (req, res) => {
    console.log('recipeController.parseRecipe called')
    // Retrieve and validate the input URL
    const { url, preferences } = req.body;
      console.log(req.body)

    if (!url || !preferences) {
        return res.status(404).json({ error: 'URL and preferences are required' });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    try {
        // Scrape the recipe
        const rawRecipeData = await clipRecipeFromUrl(url);
            console.log('rawRecipeData:')
            console.log(rawRecipeData)

        let recipeDataJson = JSON.stringify(rawRecipeData)
            console.log(`recipeDataJson: ${recipeDataJson}`)

        // Process recipe with Anthropic
        const modifiedRecipe = await processWithAnthropic(recipeDataJson, preferences);
            console.log('modifiedRecipe:')
            console.log(modifiedRecipe)

        // Respond with processed recipe data as JSON
        res.json({ reply: modifiedRecipe });
    } catch (error) {
        console.error('Error in POST handlers:', error);
        res.status(500).json({ error: 'Error scraping the recipe' });
    }
};

exports.saveRecipe = async (req, res) => {
    console.log('recipeController.saveRecipe called');
    const { userID, recipe, url, preferences } = req.body;

    console.log(req.body)

    if (!userID || !recipe || !url || !preferences) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Find the user in the database
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the recipe to the user's recipes
        user.recipes.push({ recipe, url, preferences });
        await user.save();

        res.json({ message: 'Recipe saved successfully', recipes: user.recipes });
    } catch (error) {
        console.error('Error saving the recipe:', error.message);
        res.status(500).json({ error: 'An error occurred while saving the recipe' });
    }
};

exports.getRecipes = async (req, res) => {
    console.log('recipeController.getRecipes called');
    const userID = req.params.userID;

    if (!userID) {
        return res.status(400).json({ error: 'UserID is required' });
    }

    try {
        // Find the user in the database
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ recipes: user.recipes });
    } catch (error) {
        console.error('Error getting recipes:', error.message);
        res.status(500).json({ error: 'An error occurred while getting recipes' });
    }
};

const processWithAnthropic = async (recipeDataJson, preferences) => {
    const prompt = 'You are a recipe assistant who takes in recipes and return modified versions of those recipes based on the user\'s dietary preferences. Please respond with a modified recipe as JSON data in the same format you recieved it. For the ingredients and instructions, please format the values as arrays and not with new lines. Do not include anything other than JSON in your response. No preamble, explanations, or text beyond the JSON structure.  If you encounter a quote to specify inches, please replace it with the word "inch" or "inches". Thank you!'

    const response = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          system: prompt,
          messages: [
            { role: "user", content: `Please give me a version of ${recipeDataJson} that meets my dietary preferences: ${preferences} - Thank you!` },
        ], 
    });
    return response.content[0].text
}