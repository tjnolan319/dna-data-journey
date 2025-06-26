import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dna, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Trigger animations
    setIsVisible(true);
    
    // Generate floating particles
    const particleArray = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      size: Math.random() * 20 + 10,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(particleArray);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s',
          }}
        />
      ))}

      {/* Floating DNA Helixes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 opacity-10">
          <Dna className="h-24 w-24 text-blue-300 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <div className="absolute bottom-32 right-32 opacity-10">
          <Dna className="h-32 w-32 text-purple-300 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        </div>
        <div className="absolute top-1/2 left-10 opacity-10">
          <Dna className="h-20 w-20 text-green-300 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className={`text-center z-10 max-w-2xl mx-auto px-4 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* Glowing 404 */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-400 opacity-20 blur-lg animate-pulse">
            404
          </div>
        </div>

        {/* DNA Icon with Pulse Effect */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse opacity-30 absolute"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-ping opacity-40 absolute"></div>
          <Dna className="h-16 w-16 text-white animate-spin relative z-10" style={{ animationDuration: '6s' }} />
        </div>

        {/* Error Message */}
        <div className={`space-y-4 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            DNA Sequence Not Found
          </h2>
          <p className="text-xl text-blue-200 mb-2">
            Looks like this page got lost in the data helix!
          </p>
          <p className="text-lg text-slate-300">
            The path <span className="font-mono text-blue-300 bg-slate-800 px-2 py-1 rounded">
              {location.pathname}
            </span> doesn't exist in our professional genome.
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Home Base
          </Button>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Fun DNA Facts */}
        <div className={`mt-16 p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-blue-500/30 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <h3 className="text-lg font-semibold text-blue-300 mb-2">
            💡 Did you know?
          </h3>
          <p className="text-slate-300 text-sm">
            Just like DNA has 4 base pairs (A, T, G, C), HTTP has status codes! 
            404 means "Not Found" - but don't worry, your perfect career opportunity is still out there!
          </p>
        </div>
      </div>

      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-lg opacity-30">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
      </div>
    </div>
  );
};

export default NotFound;
