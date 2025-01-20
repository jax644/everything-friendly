const { JSDOM } = require("jsdom");
const sanitizeHtml = require("sanitize-html");
const RecipeClipper = require("@julianpoy/recipe-clipper");

// Utility function to check if a string is a valid URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}

// Utility function to clip a recipe from a URL
async function clipRecipeFromUrl(clipUrl) {
    const response = await fetch(clipUrl);
    const html = await response.text();
    const dom = new JSDOM(html);
    const { window } = dom;

    Object.defineProperty(window.Element.prototype, 'innerText', {
        get() {
            const html = replaceBrWithBreak(this.innerHTML);
            return sanitizeHtml(html, {
                allowedTags: [],
                allowedAttributes: {},
            });
        },
    });

    window.fetch = fetch;

    return await RecipeClipper.clipRecipe({
        window,
        mlDisable: false,
        ignoreMLClassifyErrors: true,
    });
}

// Utility function to replace <br> tags with newline characters
function replaceBrWithBreak(html) {
    return html.replaceAll(/<br( \/)?>/g, "\n");
}

// BASE_URL constant
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

// Export all utilities and constants
module.exports = {
    isValidUrl,
    clipRecipeFromUrl,
    replaceBrWithBreak,
    BASE_URL,
    FRONTEND_BASE_URL
};
