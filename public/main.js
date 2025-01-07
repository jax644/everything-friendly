// Add event listener for form submission
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    const urlInput = document.getElementById('url').value; // Get the input value
    const recipeContainer = document.getElementById('recipeContainer'); // Get the container
    
    // Clear previous results
    recipeContainer.textContent = 'Loading...';
    
    try {
        // Send the POST request to the server
        const response = await fetch('/api/parse-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urlInput }),
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the response as JSON
        const recipeData = await response.json();

        // Update the recipe container with the response data
        recipeContainer.innerHTML = `<pre>${JSON.stringify(recipeData, null, 2)}</pre>`;
    } catch (error) {
        // Handle errors
        recipeContainer.textContent = `An error occurred: ${error.message}`;
    }
});