
import "./styles.css";
import './App.css'

// Simple test to confirm Tailwind CSS works

function App() {
  return (
    <div className="min-h-screen bg-sky-gradient flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-soft p-10 text-center">
        <h1 className="text-4xl font-display font-bold text-primary">
          FX Quest
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Welcome to Currency Kingdom!
        </p>

        <button className="mt-6 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground">
          Start Adventure
        </button>
      </div>
    </div>
  );
}

export default App;