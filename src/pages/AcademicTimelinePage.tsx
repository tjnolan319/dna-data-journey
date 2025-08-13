
import React, { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { DNATimeline } from "@/components/DNATimeline";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AcademicTimelinePage = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center space-x-2 bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
      <DNATimeline />
    </div>
  );
};

export default AcademicTimelinePage;
