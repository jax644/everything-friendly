import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import routesConfig from './routes/routesConfig';
import ProtectedRoute from './routes/protectRoute';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header isAuthenticated={isAuthenticated} user={user}/>
        <main className="flex-column">
          <Routes>
            {routesConfig.map(({ path, element: Element, isProtected }, index) => (
                <Route
                  key={index}
                  path={path}
                  element={
                    isProtected
                      ?
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Element user={user} />
                      </ProtectedRoute>
                      : 
                      <Element
                        setIsAuthenticated={setIsAuthenticated}
                        setUser={setUser}
                        isAuthenticated={isAuthenticated}
                        user={user}
                      />
                    }
                />
              ))
            }
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
