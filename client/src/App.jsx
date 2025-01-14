import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import './App.css'

function App() {

  return (
    <>
      < Header />
      <main className="flex-column">
          <p id="description">Enjoy any online recipe, adjusted to meet your dietary needs and preferences.</p>
        <RecipeGenerationForm/>
      </main>
    </>
  )

}

export default App;
