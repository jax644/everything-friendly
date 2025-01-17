import React from 'react';
import './Recipe.css';

function Recipe ({ recipe, url, preferences }) {
    console.log(`Recipe component called`)

    // Error handling
    if (!recipe) {
        console.log('recipe is null')
        return null;
    }

    if (recipe.error) {
        return ( 
            <section id="recipe-container" className="flex-column">
                <h1 id="recipe-title">{recipe.error}</h1>
            </section>
        )
    }

    // Save recipe function
    async function saveRecipe() {
        console.log('Saving recipe...')
        // const recipeData = JSON.stringify(recipe);

        // await fetch(`${BASE_URL}/api/save-recipe`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: recipeData
        // })
    }

    // Make another recipe function
    function makeAnother() {
        setRecipe(null);       // Clear the recipe data
        setShowForm(true);     // Show the recipe generation form
        setIsLoading(false);   // Ensure loading state is reset
        }

    return (
        <section id="recipe-container" className="flex-column">

            <h1 id="recipe-title">{recipe.title}</h1>
            <hr/>

            <div id="recipe-details" className="flex">
                <div id="recipe-block-container" className="flex-column">

                    {/* Display image block only if image is successfully retrieved */}
                    {recipe.imageURL && 
                        <div id="recipe-img-container">
                            <img id="recipe-image" src={recipe.imageURL} alt="recipe image"/>
                        </div>
                    }
                        {/* Display time and yield block only if at least one data point is retrieved */}
                        { recipe.yield || recipe.activeTime || recipe.totalTime &&
                            <div id="time-and-yield-container">
                                <h2>Time & Yield</h2>
                                <ul>
                                    { recipe.yield &&
                                        <>
                                            <li>
                                                <strong>Yield: </strong>
                                                <span>{recipe.yield}</span>
                                            </li>
                                        </>
                                    }
                                    { recipe.activeTime &&
                                        <>
                                            <li>
                                                <strong>Prep Time: </strong>
                                                <span>{recipe.activeTime}</span>
                                            </li> 
                                        </>
                                    }
                                    { recipe.totalTime &&
                                        <>
                                            <li>
                                                <strong>Total Time: </strong>
                                                <span>{recipe.totalTime}</span>
                                            </li>
                                        </>
                                    }     
                                </ul>
                            </div>
                        }
                    </div>

                    <div id="ai-disclaimer">
                        <h2>Enjoy safely!</h2>
                        <p>This recipe was generated with Claude’s Anthropic AI. While the AI model is generally reliable, AI recommendations may not always be perfect. Please double-check the recipe ingredients to ensure they meet your preferences and requirements before cooking.</p>
                    </div>

                    <div class="button-container">
                        <button id="save-recipe" onClick={saveRecipe}>Save recipe</button>
                        <button id="make-another" onClick={makeAnother}>Generate another recipe</button>
                    <div/>
                </div>

                <div id="ingredients-and-instructions" className="flex-column">
                    <div id="recipe-ingredients-container">
                        <h2>Ingredients</h2>
                        <ul id="recipe-ingredients">
                            { recipe.ingredients && recipe.ingredients.map((ingredient, index) => 
                                <li key={index}>{ingredient}</li>
                            )}
                        </ul>
                    </div>
                    <div id="recipe-instructions-container">
                        <h2>Instructions</h2>
                        <ol id="recipe-instructions">
                            { recipe.instructions && recipe.instructions.map((instruction, index) => 
                                <li key={index}>{instruction}</li>
                            )}
                        </ol>
                    </div>
                </div>

            </div>

            <div id="ai-disclaimer-mobile">
                <h2>Enjoy safely!</h2>
                <p>This recipe was generated with Claude’s Anthropic AI. While the AI model is generally reliable, AI recommendations may not always be perfect. Please double-check the recipe ingredients to ensure they meet your preferences and requirements before cooking.</p>
            </div><br/>
            <hr/>

            <div id="original-recipe-details" className="flex">
                <p>
                    <strong>Original recipe:</strong>
                    <a id="original-recipe-link" href={url} target="_blank">Link</a>
                </p>
                <p>
                    <strong>Your requirements: </strong>
                    <span id="original-recipe-requirements">{preferences}</span>
                </p>
            </div>
        </section>
    )
}

export default Recipe;