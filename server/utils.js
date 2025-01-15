const { JSDOM } = require("jsdom");
const sanitizeHtml = require("sanitize-html");
const RecipeClipper = require("@julianpoy/recipe-clipper");
exports.isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
};

exports.clipRecipeFromUrl = async (clipUrl) => {
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
};

const replaceBrWithBreak = (html) => html.replaceAll(/<br( \/)?>/g, "\n");