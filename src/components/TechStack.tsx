
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

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
    <section id="tech-stack" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-8 sm:mb-10 lg:mb-12 text-center">
          My Tech <span className="text-blue-600">DNA</span>
        </h2>
        
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {techStack.map((tech, index) => (
              <Card 
                key={tech.name} 
                className={`hover:shadow-lg transition-all duration-300 hover:scale-105 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 mb-1 leading-tight">{tech.name}</div>
                  <div className="text-xs text-slate-500 leading-tight">{tech.category}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
