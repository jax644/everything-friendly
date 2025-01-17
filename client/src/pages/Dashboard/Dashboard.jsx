import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecipePreview from '../../components/RecipePreview/RecipePreview';
import './Dashboard.css';

function Dashboard() {

    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    let testRecipe =
        {
            imageURL: "https://cookieandkate.com/images/2015/10/thai-red-curry-with-vegetables-1-225x225.jpg",
            title: "Vegan Thai Red Curry With Vegetables",
            description: "",
            source: "Cookie and Kate",
            yield: "4 Servings",
            activeTime: "10 Mins",
            totalTime:"40 Minutes",

            ingredients: ["Food"],
            instructions: ["Have fun"],
            notes: "",
            url: "https://cookieandkate.com/thai-red-curry-recipe/",
            preferences:"vegan"
        }

    let recipes = [testRecipe, testRecipe, testRecipe, testRecipe]
 



    // async function getRecipes () {
    //     await fetch('/api/recipes');
    //     recipes = await response.json();
    // }
    
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="dashboard">
            <h1>{user.name}'s Dashboard</h1>
            <hr/>
            <h2>My Recipes</h2>
            <div id="recipe-preview-container" className="flex">
                { recipes 
                    ?
                    recipes.map((recipe, index) => (
                        <RecipePreview recipe={recipe} key={index}/>
                    ))
                    :
                    <p>No recipes to show. Try generating a new recipe now!</p>
                }
            </div>
            <hr/>
        </div>
    );
}

export default Dashboard;