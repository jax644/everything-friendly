import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import './App.css'

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="flex-column">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<RecipeGenerationForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
