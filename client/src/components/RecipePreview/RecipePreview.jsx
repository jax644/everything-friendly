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
                <div className="image-container">
                    <img 
                        src={recipe.recipe.imageURL} 
                        alt={recipe.recipe.title} 
                        className="recipe-image"
                    />
                    <div className="overlay">
                        <h2 className="recipe-title">{recipe.recipe.title}</h2>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default RecipePreview;
