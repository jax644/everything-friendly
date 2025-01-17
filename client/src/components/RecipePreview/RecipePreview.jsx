import './RecipePreview.css';
import { Link } from 'react-router-dom';

function RecipePreview({ recipe, index }) {
    return (
        <div className="recipe-preview" id={`recipe-preview-${index}`}>
            <Link 
                to={{
                    pathname: `/recipe/${recipe._id}`
                }}
                state={{
                    recipe: recipe.recipe,
                    url: recipe.url,
                    preferences: recipe.preferences
                }}
            >
                <img src={recipe.recipe.imageURL} alt={recipe.recipe.title} />
            </Link>
        </div>
    );
}

export default RecipePreview;
