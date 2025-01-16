import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
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
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
