import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import LoadingDisplay from './components/LoadingDisplay/LoadingDisplay';
import Recipe from './components/Recipe';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  const handleFormSubmit = async (url, preferences) => {
    setIsLoading(true); // Show LoadingDisplay
    try {
      // Simulate API request here or call the actual API
      const response = await axios.post('http://localhost:3000/api/parse-recipe', { url, preferences });
      const recipeData = JSON.parse(cleanData(response.data.reply))
      
      setRecipe(recipeData); // Set the received recipe data

    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setIsLoading(false); // Hide LoadingDisplay and show Recipe component once data is received
    }
  };

  const cleanData = (inputString) => {
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
      < Header />
      <main className="flex-column">
          <p id="description">Enjoy any online recipe, adjusted to meet your dietary needs and preferences.</p>

        {isLoading ? (
          <LoadingDisplay />
        ) : recipe ? (
          <Recipe recipe={recipe} /> // Show recipe if available
        ) : (
          <RecipeGenerationForm onSubmit={handleFormSubmit} /> // Show form if no recipe data
        )}

      </main>
    </>
  )
}

export default App;
