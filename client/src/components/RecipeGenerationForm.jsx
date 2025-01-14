function RecipeGenerationForm() {
    return (
        <form id="recipe-form">
                <label htmlFor="preferences">Enter your dietary preferences</label> <br/>
                <input type="text" name="preferences" id="preferences" placeholder="Vegan, Kosher, I don't like beans" required /> <br/>
                
                <label htmlFor="url">Enter a recipe URL</label> <br/>
                <input type="url" name="url" id="url" placeholder="https://www.yummyrecipes.com/cookies/" required /> <br/>
                
                <button type="submit">Make it friendly</button>
        </form>
    );
}

export default RecipeGenerationForm;