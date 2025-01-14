import React from 'react';

function Recipe ({ recipe, url, preferences }) {
    if (!recipe) return null;

    if (recipe.error) {
        return ( 
            <section id="recipe-container" className="flex-column">
                <h1 id="recipe-title">{recipe.error}</h1>
            </section>
        )
    }

    return (
        <section id="recipe-container" className="flex-column">

            <h1 id="recipe-title">{recipe.title}</h1>
            <hr/>

            <div id="recipe-details" className="flex">
                <div id="recipe-block-container" className="flex-column">

                {recipe.imageURL && 
                    <div id="recipe-img-container">
                        <img id="recipe-image" src={recipe.imageURL} alt="recipe image"/>
                    </div>
                }

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

                    <div id="ai-disclaimer">
                        <h2>Enjoy safely!</h2>
                        <p>This recipe was generated with Claude’s Anthropic AI. While the AI model is generally reliable, AI recommendations may not always be perfect. Please double-check the recipe ingredients to ensure they meet your preferences and requirements before cooking.</p>
                    </div>
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