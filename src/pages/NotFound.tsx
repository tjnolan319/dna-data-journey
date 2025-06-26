import { useEffect, useState } from "react";
import { Dna, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const [funnyPhrase, setFunnyPhrase] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  const phrases = [
    "DNA Sequence Not Found",
    "Looks like this page got lost in the data helix!",
    "This path doesn't exist in our professional genome."
  ];

  useEffect(() => {
    // Get current path (in a real app, this would come from useLocation)
    const path = window.location?.pathname || "/unknown-path";
    setCurrentPath(path);
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      path
    );
    
    // Pick a random phrase
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setFunnyPhrase(randomPhrase);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-2xl mx-auto px-4">
        
        {/* Simple 404 */}
        <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-8">
          404
        </h1>

        {/* DNA Icon */}
        <div className="mb-8 flex justify-center">
          <Dna className="h-16 w-16 text-blue-600" />
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600">
            {funnyPhrase}
          </p>
          {currentPath !== "/" && (
            <p className="text-sm text-gray-500">
              The path <span className="font-mono text-blue-600 bg-gray-100 px-2 py-1 rounded">
                {currentPath}
              </span> could not be found.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
          >
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
