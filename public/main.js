// Add event listener for form submission
document.getElementById('recipeForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    let loadingContainer = document.querySelector('.loading-container')
    loadingContainer.style.display = 'block'
    
    const urlInput = document.getElementById('url').value
    const prefInput = document.getElementById('preferences').value
    console.log(`prefInput is ${prefInput}`)

    const recipeContainer = document.getElementById('recipeContainer')
    
    // Clear previous results
    recipeContainer.textContent = ''
    
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
        const recipeData = await response.json();
        const recipeString = recipeData.reply

        // Remove the description, the form and the loading container
        document.getElementById('description').style.display = 'none';
        document.getElementById('recipeForm').style.display = 'none';
        loadingContainer.style.display = 'none'

        // Update the recipe container with the response data
        recipeContainer.innerHTML = `<p>${recipeString}</p>`;
    } catch (error) {
        // Handle errors
        recipeContainer.textContent = `An error occurred: ${error.message}`;
    }
});