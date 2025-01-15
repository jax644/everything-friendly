import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import LoginPage from './pages/LoginPage';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      < Header isAuthenticated={isAuthenticated} user={user}/>
      <main className="flex-column">
        <Routes>
          <Route
            path="/"
            element={
              <RecipeGenerationForm
                isAuthenticated={isAuthenticated}
                user={user}
              />
            }
          />

          <Route
            path="/login"
            element={
              < LoginPage 
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            }
          />
        </Routes>
      
        
      </main>

    </BrowserRouter>
  )

}

export default App;
