import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header.jsx";
import GenerateRecipe from "./pages/GenerateRecipe.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import RecipePage from "./pages/RecipePage.jsx";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="flex-column">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<GenerateRecipe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/recipe/:id" element={<RecipePage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
