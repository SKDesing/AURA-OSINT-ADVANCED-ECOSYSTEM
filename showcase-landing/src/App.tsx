import React from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Architecture } from './components/Architecture';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Hero />
      <Features />
      <Architecture />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;