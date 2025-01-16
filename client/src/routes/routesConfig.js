import RecipeGenerationForm from '../components/RecipeGenerationForm';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';

const routesConfig = [
  {
    path: '/',
    element: RecipeGenerationForm,
    isProtected: false,
  },
  {
    path: '/login',
    element: LoginPage,
    isProtected: false,
  },
  {
    path: '/dashboard',
    element: Dashboard,
    isProtected: true,
  },
];

export default routesConfig;
