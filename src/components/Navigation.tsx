
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="font-bold text-xl text-slate-800">
            My Professional DNA
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('tech-stack')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Tech Stack
            </button>
            <button 
              onClick={() => scrollToSection('gantt')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Timeline
            </button>
            <button 
              onClick={() => scrollToSection('data-gallery')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Portfolio
            </button>
            <button 
              onClick={() => scrollToSection('dna-timeline')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Experience
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <button 
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('tech-stack')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Tech Stack
            </button>
            <button 
              onClick={() => scrollToSection('gantt')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Timeline
            </button>
            <button 
              onClick={() => scrollToSection('data-gallery')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Portfolio
            </button>
            <button 
              onClick={() => scrollToSection('dna-timeline')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Experience
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
