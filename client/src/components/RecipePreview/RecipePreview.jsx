import './RecipePreview.css';

function RecipePreview({ recipe, index }) {
    return (
        <div className="recipe-preview" id={`recipe-preview-${index}`}>
            <img src={recipe.recipe.imageURL} alt={recipe.recipe.title} />
        </div>
    );
}

export default RecipePreview;