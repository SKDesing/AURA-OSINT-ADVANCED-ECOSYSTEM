
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Hero from './components/Hero';
import Services from './components/Services';
import Impact from './components/Impact';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <main>
        <Hero />
        <Services />
        <Impact />
        <Contact />
      </main>
    </div>
  );
}

export default App;
