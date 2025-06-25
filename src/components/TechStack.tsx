
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const techStack = [
  { name: "SQL", category: "Database" },
  { name: "Python", category: "Programming" },
  { name: "R Programming", category: "Statistics" },
  { name: "SPSS", category: "Statistics" },
  { name: "Alteryx", category: "Data Workflow" },
  { name: "Excel", category: "Analytics" },
  { name: "Tableau", category: "Visualization" },
  { name: "Power BI", category: "Visualization" },
  { name: "Drupal", category: "Website Editing" },
  { name: "Hubspot", category: "CRM & Marketing" },
  { name: "Qualtrics", category: "Survey & Research" },
];

export const TechStack = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('tech-stack');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className={`lg:col-span-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex flex-col items-center text-center space-y-6">
              <Avatar className="w-32 h-32 border-4 border-blue-200">
                <AvatarImage 
                  src="/lovable-uploads/01cfb1ee-b214-4fc4-a824-19f89c135827.png" 
                  alt="Timothy Nolan Profile Picture" 
                />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">TN</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className={`lg:col-span-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h2 className="text-4xl font-bold text-slate-800 mb-8 text-center lg:text-left">
              My Tech <span className="text-blue-600">DNA</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <Card 
                  key={tech.name} 
                  className={`hover:shadow-lg transition-all duration-300 hover:scale-105 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-semibold text-slate-800 mb-1">{tech.name}</div>
                    <div className="text-xs text-slate-500">{tech.category}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
