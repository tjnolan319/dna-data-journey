import { useEffect, useState } from "react";
import { Dna } from "lucide-react";

// ✅ Import your local profile image from assets
import profilePic from "@/assets/Tim_Nolan_Profile_Pic_Cropped.jpg";

export const DNAHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                <img 
                  src={profilePic} 
                  alt="Timothy Nolan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Timothy Nolan</h1>
                <p className="text-lg text-slate-600">Data & Business Strategy Analyst</p>
                <p className="text-sm text-slate-500">Waltham, MA • Available for work</p>
              </div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
              What's in my
              <span className="block text-blue-600">Professional DNA?</span>
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Recent MBA and MS in Business Analytics graduate from Bentley University, with undergraduate degrees in Marketing and Psychology. My background combines business, analytics, and behavioral science, applied in early-stage companies, research, and university-based entrepreneurship programs.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Data Analysis
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Strategic Planning
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Business Intelligence
              </span>
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                Behavioral Science
              </span>
            </div>
          </div>
          
          <div className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Dna className="h-32 w-32 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-blue-300 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
