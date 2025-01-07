const express = require('express');
const puppeteer = require('puppeteer');
const RecipeClipper = require('@julianpoy/recipe-clipper');
const jsdom =  require("jsdom");
const sanitizeHtml = require("sanitize-html");
const axios = require('axios')
const Anthropic = require('@anthropic-ai/sdk')

require('dotenv').config()

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const anthropic = new Anthropic({
    // Make sure you set an environment variable in Scrimba 
    // for ANTHROPIC_API_KEY
    apiKey: process.env.CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
})

// URL validation
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Handle URL submission
app.post('/api/parse-recipe', async (req, res) => {
    // Retrieve and validate URL
    const { url } = req.body;

    if (!url) {
        return res.status(404).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    try {
        const recipeData = await clipRecipeFromUrl(url);

        let stringifiedRecipeData = JSON.stringify(recipeData)

        // Send recipe data to Anthropic for processing
        const prompt = `You are a recipe assistant who takes in recipes and return vegan versions of those recipes. Your versions can omit ingredients or make appropriate subsitutions as needed. Please return your recipe in the same format you receieved it.`;

        const response = await anthropic.messages.create({
              model: "claude-3-haiku-20240307",
              system: prompt,
              max_tokens: 1024,
              messages: [
                { role: "user", content: `I have ${stringifiedRecipeData}, which is JSON data of a recipe. Please give me a vegan version of this recipe!` },
            ]
            });

        // Respond with processed recipe data as JSON
        res.json({ reply: response });
    } catch (error) {
        console.error('Error in POST handler:', error);
        res.status(500).json({ error: 'Error scraping the recipe' });
    }
});

// Get recipe data from URL (Copied from RecipeClipper repo)
const clipRecipeFromUrl = async function(clipUrl) {
    const response = await fetch(clipUrl);
    const html = await response.text();
  
    const dom = new jsdom.JSDOM(html);
    const { window } = dom;
  
    Object.defineProperty(window.Element.prototype, 'innerText', {
      get() {
        const html = replaceBrWithBreak(this.innerHTML);
        return sanitizeHtml(html, {
          allowedTags: [], // remove all tags and return text content only
          allowedAttributes: {}, // remove all tags and return text content only
        });
      },
    });
  
    window.fetch = fetch;
  
    return await RecipeClipper.clipRecipe({
      window,
      mlDisable: false,
      ignoreMLClassifyErrors: true,
    });
  };

// const replaceBrWithBreak = (html) => {
// return html.replaceAll(new RegExp(/<br( \/)?>/, "g"), "\n");
// };

const replaceBrWithBreak = (html) => {
    // remove 
    // replace br with break
    return html.replaceAll(new RegExp(/<br( \/)?>/, "g"), "\n");
    };

// Set up server to listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
