const express = require('express');
const puppeteer = require('puppeteer');
const RecipeClipper = require('@julianpoy/recipe-clipper');
const jsdom =  require("jsdom");
const sanitizeHtml = require("sanitize-html");

const app = express();
const PORT = 3000;

app.use(express.json());

// URL validation
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}

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

    // Respond with recipe data as JSON
    try {
        const recipeData = await clipRecipeFromUrl(url);
        res.json(recipeData);
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

const replaceBrWithBreak = (html) => {
return html.replaceAll(new RegExp(/<br( \/)?>/, "g"), "\n");
};

// Set up server to listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
