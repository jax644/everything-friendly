import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

import LoadingDisplay from '../components/LoadingDisplay/LoadingDisplay.jsx';
import Recipe from '../components/Recipe/Recipe.jsx';
import { cleanData } from '../../utils.js';


function GenerateRecipe() {
    const [showForm, setShowForm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [recipeSaved, setRecipeSaved] = useState(false);
    const [recipeSaveError, setRecipeSaveError] = useState(false);

    const [url, setUrl] = useState('');
    const [preferences, setPreferences] = useState('');

    // Set the base URL for the API call based on dev or production environment
    const isProduction= process.env.NODE_ENV === 'production';
    const BASE_URL = isProduction ? 'https://everything-friendly.onrender.com' : 'http://localhost:3000';

    const {user} = useContext(AuthContext);
    let userID = null;
    if (user) {
        userID = user._id;
    }


    // Function to generate a new recipe using the URL and preferences from the user
    async function handleSubmit (event, url, preferences) {
        // Prevent refresh
        event.preventDefault();

        setIsLoading(true); // Show LoadingDisplay
    
        try {
            // Send the URL and preferences to the API for processing
            const response = await axios.post(`${BASE_URL}/api/parse-recipe`, { url, preferences });
            
            // Parse and set the received recipe data
            const recipeData = JSON.parse(cleanData(response.data.reply))
            setRecipe(recipeData);

            console.log(`Recipe data: ${recipeData}`)
        } catch (error) {
            console.error('Error fetching recipe:', error);
        } finally {
            // Hide the form and the loading display when the recipe data is ready to be displayed
            setShowForm(false);
            setIsLoading(false);
        }
    };
    
    // Function to save the recipe to the database
    async function saveRecipe() {
        try {
            // Reset error and saved state before starting
            setRecipeSaveError(false);
            setRecipeSaved(false);
            
            // Send the recipe and user data to the server
            console.log(`userID: ${userID}, recipe: ${recipe}, url: ${url}, preferences: ${preferences}`)
            const response = await axios.post(`${BASE_URL}/api/save-recipe`, { userID, recipe,  url, preferences });
            
            // Handle server response (optional: check for success status)
            if (response.status === 200) {
                setRecipeSaved(true);
                console.log('Recipe saved successfully:', response.data);
            } else {
                throw new Error('Unexpected response from server');
            }
        } catch (error) {
            // Log the error and set the error state
            setRecipeSaveError(true);
            console.error('Error saving recipe:', error.response ? error.response.data : error.message);
        } 
    }

    // Function to reset the page so that the user can generate another recipe
    function makeAnother() {
        setRecipe(null);
        setShowForm(true);
        setIsLoading(false);
    }
  

    return (
        <>
            { showForm && 
                <>
                <p id="description">Enjoy any online recipe, adjusted to meet your dietary needs and preferences.</p>
                <form id="recipe-form" onSubmit={event => handleSubmit(event, url, preferences)}>
                    <label htmlFor="preferences">Enter your dietary preferences</label>
                        <input 
                            type="text" 
                            name="preferences" 
                            id="preferences"
                            value={preferences}
                            onChange={event => setPreferences(event.target.value)}
                            placeholder="Vegan, Kosher, I don't like beans"
                            required
                        /> 
                    <label htmlFor="url">Enter a recipe URL</label> 
                        <input 
                            type="url" 
                            name="url" 
                            id="url" 
                            value={url}
                            onChange={event => setUrl(event.target.value)}
                            placeholder="https://www.yummyrecipes.com/cookies/" 
                            required 
                        />
                    <button type="submit">Make it friendly</button>
                </form>
                </>
            }

            {isLoading 
                ? 
                <LoadingDisplay /> 
                :
                <>
                    <Recipe 
                        recipe={recipe} 
                        url={url} 
                        preferences={preferences} 
                    />
                    { recipe &&
                        <div className="flexed-button-pair">
                            <button id="save-recipe" className="secondary-button" onClick={saveRecipe}>Save recipe</button>
                                { recipeSaved && <p>Recipe saved successfully!</p> }
                                { recipeSaveError && <p>Error saving recipe</p> }
                            <button id="make-another" onClick={makeAnother}>Make another recipe</button>
                        </div>
                    }
                </>
            }
        </>
    );
}




export default GenerateRecipe;