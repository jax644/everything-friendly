import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import LoginPage from './pages/LoginPage';
import './App.css'
import Dashboard from './pages/Dashboard';
import cors from 'cors';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      < Header isAuthenticated={isAuthenticated} user={user}/>
      <main className="flex-column">
        <Routes>
          {/* Public routes */}
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
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated 
               ? 
                <Dashboard user={user} />
               : 
                <LoginPage
                  setIsAuthenticated={setIsAuthenticated}
                  setUser={setUser}
                  redirectTo="/dashboard"
                />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )

}

export default App;
