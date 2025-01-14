import { useState } from 'react';

function RecipeGenerationForm({onSubmit}) {

    const [url, setUrl] = useState('');
    const [preferences, setPreferences] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(url, preferences);
    };

    return (
        <form id="recipe-form" onSubmit={handleSubmit}>
            <label htmlFor="preferences">
                Enter your dietary preferences
                <input 
                    type="text" 
                    name="preferences" 
                    id="preferences"
                    value={preferences}
                    onChange={event => setPreferences(event.target.value)}
                    placeholder="Vegan, Kosher, I don't like beans"
                    required
                /> <br/>
            </label> <br/>
            <label htmlFor="url">
                Enter a recipe URL
                <input 
                    type="url" 
                    name="url" 
                    id="url" 
                    value={url}
                    onChange={event => setUrl(event.target.value)}
                    placeholder="https://www.yummyrecipes.com/cookies/" 
                    required 
                /> <br/>
            </label> <br/>
            <button type="submit">Make it friendly</button>
        </form>
    );
}

export default RecipeGenerationForm;