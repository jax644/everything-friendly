import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import './App.css'

function App() {

  return (
    <>
      < Header />
      <main className="flex-column">
        <RecipeGenerationForm/>
      </main>
    </>
  )

}

export default App;
