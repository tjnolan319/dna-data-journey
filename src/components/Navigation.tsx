
import { useState, useEffect } from "react";
import { Menu, X, Download, Github, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const easternTime = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(easternTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleResumeDownload = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_active', true)
        .order('upload_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const resume = data[0];
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('resumes')
          .download(resume.file_path);

        if (downloadError) throw downloadError;

        // Create download link
        const url = URL.createObjectURL(fileData);
        const link = document.createElement('a');
        link.href = url;
        link.download = resume.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Update download count
        await supabase
          .from('resumes')
          .update({ 
            download_count: resume.download_count + 1,
            last_download: new Date().toISOString()
          })
          .eq('id', resume.id);
      } else {
        alert('Resume is currently being updated. Please try again later.');
      }
    } catch (error) {
      console.error('Resume download error:', error);
      alert('Could not download resume. Please try again.');
    }
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/tjnolan319', '_blank');
  };

  const handleSignupClick = () => {
    navigate('/signup');
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsOpen(false);
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
              onClick={() => scrollToSection('projects')}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Portfolio
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
              <button
                onClick={handleSignupClick}
                className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
              <button
                onClick={handleLoginClick}
                className="flex items-center space-x-2 border border-slate-300 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            </div>
          </div>

          <div className="md:hidden pt-8">
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
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Portfolio
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
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600"
            >
              Contact
            </button>
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
              <div className="px-4 py-2 text-sm text-slate-600">
                <div className="mb-1">Current Time: {currentTime} EST</div>
                <div className="mb-1">Time Zone: Eastern Time (EST)</div>
                <div>Location: Waltham, MA</div>
              </div>
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
              <button
                onClick={handleSignupClick}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mx-4"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up for Lab Notes</span>
              </button>
              <button
                onClick={handleLoginClick}
                className="flex items-center justify-center space-x-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors mx-4"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
