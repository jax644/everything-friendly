import Header from './components/Header';
import RecipeGenerationForm from './components/RecipeGenerationForm';
import './App.css'

function App() {
  console.log('Hello from App.js')

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
