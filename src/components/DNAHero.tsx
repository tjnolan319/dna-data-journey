
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, TrendingUp, Database } from "lucide-react";
import profileImage from "@/assets/Tim_Nolan_Profile_Pic_Cropped.jpg";

const portfolioItems = [
  {
    id: "genre-analysis",
    title: "Emmy Genre Analysis",
    category: "Statistical Modeling",
    description: "Advanced statistical analysis revealing genre bias in Emmy nominations using logistic regression and effect size calculations.",
    tags: ["Python", "Statistical Analysis", "Data Visualization"],
    color: "bg-blue-600",
    route: "/genre-category-analysis"
  },
  {
    id: "network-analysis", 
    title: "Skillset Network",
    category: "Network Visualization",
    description: "Interactive D3.js network showing skill relationships and career progression through connected competencies.",
    tags: ["D3.js", "Network Analysis", "Interactive Viz"],
    color: "bg-purple-600",
    route: "/skillset-network"
  }
];

const whatsNewItems = [
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Timeline Views",
    description: "Interactive Gantt charts for career & academic progression"
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Advanced Analytics",
    description: "Statistical modeling with effect size calculations"
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Data Architecture",
    description: "Big data processing and visualization pipelines"
  }
];

export const DNAHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % portfolioItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % portfolioItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={profileImage} 
                  alt="Tim Nolan" 
                  className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                />
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-2">
                    Tim Nolan
                  </h1>
                  <p className="text-xl lg:text-2xl text-blue-200">
                    Data Analyst & Business Strategist
                  </p>
                </div>
              </div>
              
              <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-2xl">
                Transforming complex data into strategic insights through advanced analytics, statistical modeling, and interactive visualizations that drive business decisions.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">What's New</h3>
                <div className="grid gap-4">
                  {whatsNewItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-blue-100">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Featured Projects</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="w-full flex-shrink-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {item.category}
                          </Badge>
                        </div>
                        <h4 className="text-xl font-bold text-white">{item.title}</h4>
                        <p className="text-blue-100">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="border-white/30 text-white">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                          onClick={() => window.location.href = item.route}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Explore Project
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-2 mt-6">
                {portfolioItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
