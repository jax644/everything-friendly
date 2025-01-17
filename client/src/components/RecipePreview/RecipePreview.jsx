import './RecipePreview.css';

function RecipePreview({ recipe, index }) {
    return (
        <div className="recipe-preview" id={`recipe-preview-${index}`}>
            <img src={recipe.imageURL} alt={recipe.title} />
        </div>
    );
}

export default RecipePreview;