// Add event listener for form submission
document.getElementById('recipe-form').addEventListener('submit', async (event) => {
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
        console.log(recipeJSON)

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
        document.getElementById('form-container').style.display = 'none';
        loadingContainer.style.display = 'none'

        // Update the recipe container with the response data
        const title = document.getElementById('recipe-title')   
        title.textContent = recipeJSON.title

        const image = document.getElementById('recipe-image')
        const imageContainer = document.getElementById('recipe-img-container')
        if (!recipeJSON.imageURL) {
            imageContainer.style.display = 'none'
        } else {
            image.src = recipeJSON.imageURL
        }

        const yield = document.getElementById('recipe-yield')
        yield.textContent = recipeJSON.yield

        const prepTime = document.getElementById('prep-time')
        prepTime.textContent = recipeJSON.activeTime

        const totalTime = document.getElementById('total-time')
        totalTime.textContent = recipeJSON.totalTime

        const ingredients = document.getElementById('recipe-ingredients')
        for (let i = 0; i < recipeJSON.ingredients.length; i++) {
            const li = document.createElement('li')
            li.textContent = recipeJSON.ingredients[i]
            ingredients.appendChild(li)
        }

        const instructions = document.getElementById('recipe-instructions')
        for (let i = 0; i < recipeJSON.instructions.length; i++) {
            const li = document.createElement('li')
            li.textContent = recipeJSON.instructions[i]
            instructions.appendChild(li)
        }

        recipeContainer.style.display = 'block'
        // recipeContainer.innerHTML = `<p>${recipeJSON}</p>`;
    } catch (error) {
        // Handle errors
        recipeContainer.textContent = `An error occurred: ${error.message}`;
    }
});