import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecipePreview from "../../components/RecipePreview/RecipePreview";
import "./Dashboard.css";
import { BASE_URL } from "../../../utils";

function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const recipeSent = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      const userID = user._id;
      let cachedRecipe = null;
      try {
        cachedRecipe = JSON.parse(localStorage.getItem("cachedRecipe"));
      } catch (error) {
        console.error("Error parsing cached recipe data:", error);
      }
      const fetchAndSendRecipe = async () => {
        try {
          if (cachedRecipe && !recipeSent.current) {
            recipeSent.current = true;
            await sendCachedRecipe(userID, cachedRecipe);
          }
          await getRecipes();
        } catch (error) {
          console.error("Error in Dashboard:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAndSendRecipe();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  async function sendCachedRecipe(userID, cachedRecipe) {
    try {
      const response = await axios.post(`${BASE_URL}/api/save-recipe`, {
        userID,
        recipe: {
          title: cachedRecipe.title,
          imageURL: cachedRecipe.imageURL,
          ingredients: cachedRecipe.ingredients,
          instructions: cachedRecipe.instructions,
          yield: cachedRecipe.yield,
          activeTime: cachedRecipe.activeTime,
          totalTime: cachedRecipe.totalTime,
        },
        url: cachedRecipe.url,
        preferences: cachedRecipe.preferences,
      });
      if (response.status === 200) {
        localStorage.removeItem("cachedRecipe");
      } else {
        console.error(`Failed to save recipe: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error saving cached recipe:", error);
    }
  }

  async function getRecipes() {
    try {
      if (!user || !user._id) throw new Error("User ID is not available.");
      const response = await axios.get(
        `${BASE_URL}/api/get-recipes/${user._id}`
      );
      setRecipes(response.data?.recipes.reverse() || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard">
      <h1>{user?.name}&apos;s Dashboard</h1>
      <hr />
      <h2>My Recipes</h2>
      <div id="recipe-preview-container" className="flex">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <RecipePreview recipe={recipe} index={index} key={index} />
          ))
        ) : (
          <p>
            No recipes to show. <a href="/">Generate a new recipe now!</a>
          </p>
        )}
      </div>
      <hr />
    </div>
  );
}

export default Dashboard;
