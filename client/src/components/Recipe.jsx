function Recipe () {
    return (
        <section id="recipe-container" className="flex-column">

            <h1 id="recipe-title"></h1>
            <hr/>

            <div id="recipe-details" className="flex">
                <div id="recipe-block-container" className="flex-column">
                
                    <div id="recipe-img-container">
                        <img id="recipe-image" src="#" alt="recipe image"/>
                    </div>

                    <div id="time-and-yield-container">
                        <h2>Time & Yield</h2>
                        <ul>
                            <li>
                                <strong>Yield: </strong>
                                <span id="recipe-yield"></span>
                            </li>
                            <li>
                                <strong>Prep Time: </strong>
                                <span id="prep-time"></span>
                            </li>
                            <li>
                                <strong>Total Time: </strong>
                                <span id="total-time"></span>
                            </li> 
                        </ul>
                    </div>

                    <div id="ai-disclaimer">
                        <h2>Enjoy safely!</h2>
                        <p>This recipe was generated with Claude’s Anthropic AI. While the AI model is generally reliable, AI recommendations may not always be perfect. Please double-check the recipe ingredients to ensure they meet your preferences and requirements before cooking.</p>
                    </div>

                    <button id="make-another">Make another recipe</button>
                </div>

                <div id="ingredients-and-instructions" className="flex-column">
                    <div id="recipe-ingredients-container">
                        <h2>Ingredients</h2>
                        <ul id="recipe-ingredients"></ul>
                    </div>
                    <div id="recipe-instructions-container">
                        <h2>Instructions</h2>
                        <ol id="recipe-instructions"></ol>
                    </div>
                </div>

            </div>

            <div id="ai-disclaimer-mobile">
                <h2>Enjoy safely!</h2>
                <p>This recipe was generated with Claude’s Anthropic AI. While the AI model is generally reliable, AI recommendations may not always be perfect. Please double-check the recipe ingredients to ensure they meet your preferences and requirements before cooking.</p>
            </div><br/>

            <button id="make-another-mobile">Make another recipe</button>
            <hr/>

            <div id="original-recipe-details" className="flex">
                <p>
                    <strong>Original recipe:</strong>
                    <a id="original-recipe-link" href="#" target="_blank">Link</a>
                </p>
                <p>
                    <strong>Your requirements: </strong>
                    <span id="original-recipe-requirements"></span>
                </p>
            </div>

        </section>
    )
}

export default Recipe;