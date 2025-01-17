import { useState } from 'react';
import axios from 'axios';

import LoadingDisplay from './LoadingDisplay/LoadingDisplay';
import Recipe from './Recipe/Recipe.jsx';


function RecipeGenerationForm() {
    const [showForm, setShowForm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [recipe, setRecipe] = useState(null);

    const [url, setUrl] = useState('');
    const [preferences, setPreferences] = useState('');

    async function handleSubmit (event, url, preferences) {
        event.preventDefault();
        
        const isProduction= process.env.NODE_ENV === 'production';
        console.log(`isProduction: ${isProduction}`)
        const BASE_URL = isProduction ? 'https://everything-friendly.onrender.com' : 'http://localhost:3000'
        console.log(`BASE_URL: ${BASE_URL}`)
        console.log(`Full URL: ${BASE_URL}/api/parse-recipe`)

        setIsLoading(true); // Show LoadingDisplay
    
        try {
            // Call the API
            const response = await axios.post(`${BASE_URL}/api/parse-recipe`, { url, preferences });
            const recipeData = JSON.parse(cleanData(response.data.reply))
            setRecipe(recipeData); // Set the received recipe data
            console.log(`Recipe data: ${recipeData}`)
        } catch (error) {
            console.error('Error fetching recipe:', error);
        } finally {
            setShowForm(false);
            setIsLoading(false); // Hide LoadingDisplay and show Recipe component once data is received
        }
    };
    
    // Remove line breaks and escape characters from Claude's response so that JSON can be parsed
    function cleanData (inputString) {
      try {
        const cleanedString = inputString
          .replace(/\\n/g, '')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
    
        return cleanedString;
      } catch (error) {
        console.error('Error cleaning string:', error);
        return null;
      }
    };

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
                    { recipe && <button onClick={() => {
                        setRecipe(null);       // Clear the recipe data
                        setShowForm(true);     // Show the recipe generation form
                        setIsLoading(false);   // Ensure loading state is reset
                        }}>
                        Generate another recipe
                    </button>}
                </>
            }
            
        </>
    );
}




export default RecipeGenerationForm;