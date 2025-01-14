import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import LoadingDisplay from './components/LoadingDisplay';
import Recipe from './components/Recipe';

  function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  const generateRecipe = async (url, preferences) => {
    
    setIsLoading(true);
    setRecipe(null);

    try {
      const response = await axios.post('/api/parse-recipe', { url, preferences });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      const recipeJSON = cleanAndParseJSON(data.reply);
      setRecipe(recipeJSON);
    } catch (error) {
      console.error(`Error generating recipe: ${error.message}`);
      setRecipe(null);
    } finally {
      setIsLoading(false);
    }

    const cleanAndParseJSON = (inputString) => {
      try {
        const cleanedString = inputString
          .replace(/\\n/g, '')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');

        return JSON.parse(cleanedString);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    };
    
    return (
      <>
        < Header />
        <main className="flex-column">
            <p id="description">Enjoy any online recipe, adjusted to meet your dietary needs and preferences.</p>
          
          < RecipeGenerationForm onSubmit={generateRecipe} />
          < LoadingDisplay isLoading={isLoading} />
          < Recipe recipe={recipe} />
        </main>
      </>
    )
  }
}

export default App;
