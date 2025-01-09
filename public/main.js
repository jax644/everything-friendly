// Add event listener for form submission
document.getElementById('recipeForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const recipeContainer = document.getElementById('recipe-container')
    // Clear previous results
    recipeContainer.style.display = 'none'

    let loadingContainer = document.querySelector('.loading-container')
    loadingContainer.style.display = 'block'
    
    const urlInput = document.getElementById('url').value
    const prefInput = document.getElementById('preferences').value

    
    
    try {
        // Send the POST request to the server
        const response = await fetch('/api/parse-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urlInput, preferences: prefInput }),
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the response as JSON
        const claudeResponse = await response.json();
        const recipeData = claudeResponse.reply

        const recipeJSON = cleanAndParseJSON(recipeData)
        console.log(`recipeJSON: ${recipeJSON}`)

        function cleanAndParseJSON(inputString) {
            try {
              // Step 1: Clean the string by replacing problematic escape characters
              const cleanedString = inputString
                .replace(/\\n/g, '') // Remove newline markers
                .replace(/\\"/g, '"') // Replace escaped quotes
                .replace(/\\\\/g, '\\'); // Handle double backslashes
              
              // Step 2: Parse the cleaned string into a JSON object
              const parsedObject = JSON.parse(cleanedString);
              
              return parsedObject;
            } catch (error) {
              console.error("Error cleaning and parsing JSON:", error);
              return null;
            }
          }          
     

        // Remove the description, the form and the loading container
        document.getElementById('description').style.display = 'none';
        document.getElementById('recipeForm').style.display = 'none';
        loadingContainer.style.display = 'none'

        // Update the recipe container with the response data
        const title = document.getElementById('recipe-title')   
        console.log(`recipeJSON.title: ${recipeJSON.title}`) 
        title.textContent = recipeJSON.title

        const ingredients = document.getElementById('recipe-ingredients')
        console.log(`recipeJSON.ingredients: ${recipeJSON.ingredients}`)
        ingredients.textContent = recipeJSON.ingredients

        const instructions = document.getElementById('recipe-instructions')
        console.log(`recipeJSON.instructions: ${recipeJSON.instructions}`)
        instructions.textContent = recipeJSON.instructions

        recipeContainer.style.display = 'block'
        // recipeContainer.innerHTML = `<p>${recipeJSON}</p>`;
    } catch (error) {
        // Handle errors
        recipeContainer.textContent = `An error occurred: ${error.message}`;
    }
});