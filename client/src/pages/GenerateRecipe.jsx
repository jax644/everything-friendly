import { useState } from "react";
import axios from "axios";

import LoadingDisplay from "../components/LoadingDisplay/LoadingDisplay.jsx";
import Recipe from "../components/Recipe/Recipe.tsx";
import { cleanData } from "../../utils.js";
import { BASE_URL } from "../../utils.js";

function GenerateRecipe() {
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  const [formSumbitted, setFormSubmitted] = useState(false);

  const [url, setUrl] = useState("");
  const [preferences, setPreferences] = useState("");

  // Function to generate a new recipe using the URL and preferences from the user
  async function handleSubmit(event, url, preferences) {
    // Prevent refresh
    event.preventDefault();

    setFormSubmitted(true); // Call the Recipe component
    setIsLoading(true); // Show LoadingDisplay

    try {
      // Send the URL and preferences to the API for processing
      const response = await axios.post(`${BASE_URL}/api/parse-recipe`, {
        url,
        preferences,
      });

      // Parse and set the received recipe data
      const recipeData = JSON.parse(cleanData(response.data.reply));
      setRecipe({ ...recipeData, url, preferences });

      console.log(`Recipe data: ${recipeData}`);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      // Hide the form and the loading display when the recipe data is ready to be displayed
      setShowForm(false);
      setIsLoading(false);
    }
  }

  // Function to reset the page so that the user can generate another recipe
  function makeAnother() {
    setRecipe(null);
    setUrl("");
    setFormSubmitted(false);
    setShowForm(true);
    setIsLoading(false);
  }

  return (
    <>
      {showForm && (
        <>
          <p id="description">
            Enjoy any online recipe, adjusted to meet your dietary needs and
            preferences.
          </p>
          <form
            id="recipe-form"
            onSubmit={(event) => handleSubmit(event, url, preferences)}
          >
            <label htmlFor="preferences">Enter your dietary preferences</label>
            <input
              type="text"
              name="preferences"
              id="preferences"
              value={preferences}
              onChange={(event) => setPreferences(event.target.value)}
              placeholder="Vegan, Kosher, I don't like beans"
              required
            />
            <label htmlFor="url">Enter a recipe URL</label>
            <input
              type="url"
              name="url"
              id="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.yummyrecipes.com/cookies/"
              required
            />
            <button type="submit">Make it friendly</button>
          </form>
        </>
      )}

      {isLoading && <LoadingDisplay />}

      {!isLoading && formSumbitted && (
        <>
          <Recipe theRecipe={recipe} makeAnother={makeAnother} />
        </>
      )}
    </>
  );
}

export default GenerateRecipe;
