import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import HeroCanvas from './components/HeroCanvas';
import Hero from './components/Hero';
import WhatIDo from './components/WhatIDo';
import HowIDo from './components/HowIDo';
import Projects from './components/Projects';
import About from './components/About';
import { PhilosophyBar, Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <Cursor />
      <div className="noise-overlay" />
      <HeroCanvas />
      <Navbar />
      <main>
        <div id="hero"><Hero /></div>
        <div id="what"><WhatIDo /></div>
        <PhilosophyBar />
        <div id="how"><HowIDo /></div>
        <div id="projects"><Projects /></div>
        <div id="about"><About /></div>
      </main>
      <Footer />
    </>
  );
}
