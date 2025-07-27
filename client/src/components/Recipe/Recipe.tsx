import React, { useState, useContext } from "react";
import "./Recipe.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { Recipe as RecipeInterface } from "../../interfaces/interfaces";
import {
  isValidRecipe,
  getRecipeValidationErrors,
} from "../../utils/validation";

function Recipe({ recipeData }: { recipeData: RecipeInterface }) {
  const { user } = useContext(AuthContext);
  let userID = null;
  if (user) {
    userID = user._id;
  }

  const [recipeSaved, setRecipeSaved] = useState(false);
  const [recipeSaveError, setRecipeSaveError] = useState(false);

  const navigate = useNavigate();

  const makeAnother = () => {
    navigate("/");
  };

  // Function to save the recipe to the database
  async function saveRecipe() {
    try {
      // Reset error and saved state before starting
      setRecipeSaveError(false);
      setRecipeSaved(false);

      // Check if user is authenticated
      if (user) {
        // Send the recipe and user data to the server
        console.log(`userID: ${userID}, recipe: ${recipeData}`);
        const response = await axios.post(`${BASE_URL}/api/save-recipe`, {
          userID,
          recipe: {
            title: recipeData.title,
            imageURL: recipeData.imageURL,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            yield: recipeData.yield,
            activeTime: recipeData.activeTime,
            totalTime: recipeData.totalTime,
          },
          url: recipeData.url,
          preferences: recipeData.preferences,
        });

        // Handle server response
        if (response.status === 200) {
          setRecipeSaved(true);
          console.log("Recipe saved successfully:", response.data);
        } else {
          throw new Error("Unexpected response from server");
        }
      } else if (!user) {
        // Save recipe to local storage
        localStorage.setItem("cachedRecipe", JSON.stringify(recipeData));

        // Redirect to login page
        navigate("/login");
      }
    } catch (error) {
      // Log the error and set the error state
      setRecipeSaveError(true);
      console.error(
        "Error saving recipe:",
        error.response ? error.response.data : error.message
      );
    }
  }

  // Validate recipe before rendering
  if (!isValidRecipe(recipeData)) {
    const validationErrors = getRecipeValidationErrors(recipeData);
    console.error("Recipe validation failed:", validationErrors);

    return (
      <div>
        <h1>It&apos;s all our fault!</h1>
        <p>Something funky happened. Please try again.</p>
        {validationErrors.length > 0 && (import.meta as any).env?.DEV && (
          <details
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <summary>Debug Info (Development Only)</summary>
            <ul style={{ marginTop: "0.5rem" }}>
              {validationErrors.map((error, index) => (
                <li key={index} style={{ color: "#d32f2f" }}>
                  {error}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );
  }

  return (
    <>
      <section id="recipe-container" className="flex-column">
        <h1 id="recipe-title">{recipeData.title}</h1>
        <hr />

        <div id="recipe-details" className="flex">
          <div id="recipe-block-container" className="flex-column">
            {/* Display image block only if image is successfully retrieved */}
            {recipeData.imageURL && (
              <div id="recipe-img-container">
                <img
                  id="recipe-image"
                  src={recipeData.imageURL}
                  alt="recipe image"
                />
              </div>
            )}
            {/* Display time and yield block only if at least one data point is retrieved */}
            {(recipeData.yield ||
              recipeData.activeTime ||
              recipeData.totalTime) && (
              <div id="time-and-yield-container">
                <h2>Time & Yield</h2>
                <ul>
                  {recipeData.yield && (
                    <>
                      <li>
                        <strong>Yield: </strong>
                        <span>{recipeData.yield}</span>
                      </li>
                    </>
                  )}
                  {recipeData.activeTime && (
                    <>
                      <li>
                        <strong>Prep Time: </strong>
                        <span>{recipeData.activeTime}</span>
                      </li>
                    </>
                  )}
                  {recipeData.totalTime && (
                    <>
                      <li>
                        <strong>Total Time: </strong>
                        <span>{recipeData.totalTime}</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
            <div id="ai-disclaimer">
              <h2>Enjoy safely!</h2>
              <p>
                This recipe was generated with Claude’s Anthropic AI. While the
                AI model is generally reliable, AI recommendations may not
                always be perfect. Please double-check the recipe ingredients to
                ensure they meet your preferences and requirements before
                cooking.
              </p>
            </div>
          </div>

          <div id="ingredients-and-instructions" className="flex-column">
            <div id="recipe-ingredients-container">
              <h2>Ingredients</h2>
              <ul id="recipe-ingredients">
                {recipeData.ingredients &&
                  recipeData.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
              </ul>
            </div>
            <div id="recipe-instructions-container">
              <h2>Instructions</h2>
              <ol id="recipe-instructions">
                {recipeData.instructions &&
                  recipeData.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
              </ol>
            </div>
          </div>
        </div>

        <div id="ai-disclaimer-mobile">
          <h2>Enjoy safely!</h2>
          <p>
            This recipe was generated with Claude’s Anthropic AI. While the AI
            model is generally reliable, AI recommendations may not always be
            perfect. Please double-check the recipe ingredients to ensure they
            meet your preferences and requirements before cooking.
          </p>
        </div>
        <br />
        <hr />

        <div id="original-recipe-details" className="flex">
          <p>
            <strong>Original recipe:</strong>
            <a
              id="original-recipe-link"
              href={recipeData.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Link
            </a>
          </p>
          <p>
            <strong>Your requirements: </strong>
            <span id="original-recipe-requirements">
              {recipeData.preferences}
            </span>
          </p>
        </div>
      </section>

      {/* Always show the action buttons */}
      <div className="flexed-button-pair">
        <div>
          <button
            id="save-recipe"
            className="secondary-button"
            onClick={saveRecipe}
          >
            Save recipe
          </button>
          {recipeSaved && <p>Recipe saved successfully!</p>}
          {recipeSaveError && <p>Error saving recipe</p>}
        </div>

        <button id="make-another" onClick={makeAnother}>
          Make another recipe
        </button>
      </div>
    </>
  );
}

export default Recipe;
