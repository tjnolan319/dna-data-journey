
import { useState } from "react";
import { Menu, X, Download, Github } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleResumeDownload = () => {
    // Replace with your actual resume URL
    const resumeUrl = "/resume.pdf";
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Timothy_Nolan_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGitHubClick = () => {
    // Replace with your actual GitHub URL - based on your portfolio it should be your GitHub username
    window.open('https://github.com/yourusername', '_blank');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="font-bold text-xl text-slate-800">
            Timothy Nolan
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
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
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
            
            <div className="flex items-center space-x-3 border-l border-slate-300 pl-6">
              <button
                onClick={handleResumeDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Resume</span>
              </button>
              <button
                onClick={handleGitHubClick}
                className="flex items-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-200">
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
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Contact
            </button>
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
              <button
                onClick={handleResumeDownload}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-4"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </button>
              <button
                onClick={handleGitHubClick}
                className="flex items-center justify-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors mx-4"
              >
                <Github className="h-4 w-4" />
                <span>View GitHub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
