import { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './Recipe.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../../utils';
import { useNavigate } from 'react-router-dom';


function Recipe({ recipe: propsRecipe, url: propsUrl, preferences: propsPreferences, makeAnother}) {
    const location = useLocation();
    const state = location.state || {};
    
    // Use props first, fall back to state from `location`
    const recipe = propsRecipe || state.recipe;
    const url = propsUrl || state.url;
    const preferences = propsPreferences || state.preferences;

    const {user} = useContext(AuthContext);
    let userID = null;
    if (user) {
        userID = user._id;
    }

    const [recipeSaved, setRecipeSaved] = useState(false);
    const [recipeSaveError, setRecipeSaveError] = useState(false);

    const navigate = useNavigate();

    // Function to save the recipe to the database
    async function saveRecipe() {
        try {
            // Reset error and saved state before starting
            setRecipeSaveError(false);
            setRecipeSaved(false);

            // Check if user is authenticated
            if (user) {
                 // Send the recipe and user data to the server
                console.log(`userID: ${userID}, recipe: ${recipe}, url: ${url}, preferences: ${preferences}`)
                const response = await axios.post(`${BASE_URL}/api/save-recipe`, { userID, recipe,  url, preferences });
                
                // Handle server response
                if (response.status === 200) {
                    setRecipeSaved(true);
                    console.log('Recipe saved successfully:', response.data);
                } else {
                    throw new Error('Unexpected response from server');
                }
            } else if (!user){
                // Save recipe, URL and preferences to local storage
                localStorage.setItem('cachedRecipe', JSON.stringify(recipe));
                localStorage.setItem('cachedURL', url);
                localStorage.setItem('cachedPreferences', preferences);

                // Redirect to login page
                navigate('/login');
            }

        } catch (error) {
            // Log the error and set the error state
            setRecipeSaveError(true);
            console.error('Error saving recipe:', error.response ? error.response.data : error.message);
        } 
    }


    if (!recipe || !url || !preferences) {
        return (
            <div>
                <h1>It's all our fault!</h1>
                <p>Something funky happened. Please try again.</p>
            </div>
        )
    }

    return (
        <>
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
                        { (recipe.yield || recipe.activeTime || recipe.totalTime) &&
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
        
        {/* Display back to dashboard link only if recipe was requested from dashboard */}
        { state === location.state &&
            <a href="/dashboard">Back to dashboard</a>
        }

        { state != location.state &&
            <div className="flexed-button-pair">
                <div>
                    <button id="save-recipe" className="secondary-button" onClick={saveRecipe}>Save recipe</button>
                        { recipeSaved && <p>Recipe saved successfully!</p> }
                        { recipeSaveError && <p>Error saving recipe</p> }
                </div>
                
                <button id="make-another" onClick={makeAnother}>Make another recipe</button>
            </div>
        }
        
        </> 
    )
}

export default Recipe;