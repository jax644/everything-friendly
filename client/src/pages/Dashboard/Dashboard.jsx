import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipePreview from '../../components/RecipePreview/RecipePreview';
import './Dashboard.css';


const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://everything-friendly.onrender.com' : 'http://localhost:3000';

function Dashboard() {

    const { user, isAuthenticated } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

        useEffect(() => {
            if (user && user._id) {
                getRecipes();
            }
        }, []);
 

    async function getRecipes() {
        try {
            // Make the GET request to fetch recipes
            const response = await axios.get(`${BASE_URL}/api/get-recipes/${user._id}`);
            
            // Ensure the response contains the expected data
            if (response.data && response.data.recipes) {
                setRecipes(response.data.recipes); // Update the recipes state with the fetched data
                console.log('Recipes successfully retrieved:', recipes);
            } else {
                console.error('Unexpected response structure:', response.data);
            }
        } catch (error) {
            // Handle HTTP or network errors
            if (error.response) {
                // Server responded with a status code outside 2xx range
                console.error('Error fetching recipes:', error.response.status, error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
            } else {
                // Other errors during request setup
                console.error('Error setting up request:', error.message);
            }
        }
    }


    
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