
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, TrendingUp, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Genre-Category Pair Advantages at Academy Awards",
    description: "Statistical analysis of Oscar nomination patterns and win probabilities across genre-category combinations",
    industry: "Entertainment Analytics",
    impact: "Identified key strategic advantages for film positioning"
  }
];

const publications = [
  {
    title: "Advanced Predictive Analytics in Sports Performance",
    journal: "International Journal of Sports Analytics",
    year: "2024",
    description: "Comprehensive analysis of machine learning applications in professional sports forecasting",
    link: "https://example.com/publication"
  }
];

export const DNAHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23e2e8f0\" fill-opacity=\"0.3\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <img 
                src="/src/assets/Tim_Nolan_Profile_Pic_Cropped.jpg" 
                alt="Tim Nolan" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Tim <span className="text-blue-600">Nolan</span>
            </h1>
            
            <p className="text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforming complex data into <span className="text-blue-600 font-semibold">actionable insights</span> 
              through advanced analytics and strategic visualization
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Data Science', 'Business Analytics', 'Machine Learning', 'Statistical Modeling'].map((skill) => (
                <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-slate-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Boston, MA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Open to Opportunities</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>5+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* Featured Work Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Featured Project */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Featured Project</Badge>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {projects[0].title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {projects[0].industry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{projects[0].description}</p>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">{projects[0].impact}</span>
                </div>
              </CardContent>
            </Card>

            {/* Featured Publication */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Latest Publication</Badge>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {publications[0].title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {publications[0].journal} • {publications[0].year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{publications[0].description}</p>
                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Published {publications[0].year}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
