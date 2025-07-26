import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Recipe from "../components/Recipe/Recipe";
import axios from "axios";
import { BASE_URL } from "../../utils";

function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the recipe from the server using the ID
        if (id) {
          try {
            const response = await axios.get(`${BASE_URL}/api/recipe/${id}`);
            setRecipe(response.data);
          } catch (err) {
            if (err.response?.status === 404) {
              setError("Recipe not found");
            } else {
              throw err;
            }
          }
        } else {
          setError("No recipe ID provided");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div>Loading recipe...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div>
        <h1>Recipe not found</h1>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return <Recipe recipeData={recipe} />;
}

export default RecipePage;
