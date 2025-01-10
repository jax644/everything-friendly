const express = require('express');
const puppeteer = require('puppeteer');
const RecipeClipper = require('@julianpoy/recipe-clipper');
const jsdom =  require("jsdom");
const sanitizeHtml = require("sanitize-html");
const axios = require('axios')
const Anthropic = require("@anthropic-ai/sdk")
const cors = require('cors');



require('dotenv').config()

const app = express();
app.use(cors())

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
})

app.use(express.json());
app.use(express.static('public'));

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
    const { url, preferences } = req.body;

    console.log(req.body)

    if (!url) {
        return res.status(404).json({ error: 'URL is required' });
    }

    if (!preferences) {
        return res.status(404).json({ error: 'Preferences are required' });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    try {
        const recipeData = await clipRecipeFromUrl(url);
        console.log('recipeData:')
        console.log(recipeData)

        let stringifiedRecipeData = JSON.stringify(recipeData)
        console.log(`stringifiedRecipeData: ${stringifiedRecipeData}`)

        // Send recipe data to Anthropic for processing
        const prompt = 'You are a recipe assistant who takes in recipes and return modified versions of those recipes based on the user\'s dietary preferences. Please respond with a modified recipe as JSON data in the same format you recieved it. For the ingredients and instructions, please format the values as arrays and not with new lines. Do not include anything other than JSON in your response. No preamble, explanations, or text beyond the JSON structure.  If you encounter a quote to specify inches, please replace it with the word "inch" or "inches". Thank you!'

        const response = await anthropic.messages.create({
              model: "claude-3-haiku-20240307",
              max_tokens: 1024,
              system: prompt,
              messages: [
                { role: "user", content: `Please give me a version of ${stringifiedRecipeData} that meets my dietary preferences: ${preferences} - Thank you!` },
            ], 
        });
        console.log('claude response:')
        console.log(response)

        // Respond with processed recipe data as JSON
        res.json({ reply: response.content[0].text });
    } catch (error) {
        console.error('Error in POST handlers:', error);
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
