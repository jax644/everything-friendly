import "./RecipePreview.css";
import { Link } from "react-router-dom";
import { Recipe } from "../../interfaces/interfaces";
import React from "react";

function RecipePreview({ recipe, index }: { recipe: Recipe; index: number }) {
  return (
    <div className="recipe-preview" id={`recipe-preview-${index}`}>
      <Link to={`/recipe/${recipe._id}`}>
        <div className="image-container">
          <img
            src={recipe.imageURL}
            alt={recipe.title}
            className="recipe-image"
          />
          <div className="overlay">
            <h2 className="recipe-title">{recipe.title}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default RecipePreview;
