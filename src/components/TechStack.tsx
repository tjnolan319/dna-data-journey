import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const CertificationIcon = ({ certCount }: { certCount: number }) => (
  <div className="absolute top-2 left-2 flex items-center gap-0.5" title="Certified">
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20"
    >
      {/* Shield shape */}
      <path
        d="M10 2L4 4v6c0 5.5 3.84 7.74 6 8 2.16-.26 6-2.5 6-8V4l-6-2z"
        fill="#22c55e"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      {/* White star - centered */}
      <path
        d="M10 5.5l1.545 3.13L15 9.135l-2.5 2.435L13 15 10 13.265 7 15l.5-3.43L5 9.135l3.455-.505L10 5.5z"
        fill="white"
      />
    </svg>
    {certCount > 1 && (
      <span className="text-xs font-bold text-green-600 bg-white px-1 rounded">
        x{certCount}
      </span>
    )}
  </div>
);

export const TechStack = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [techStack, setTechStack] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const { data, error } = await supabase
          .from('tech_stack')
          .select('*')
          .order('display_order');

        if (error) {
          console.error('Error fetching tech stack:', error);
          return;
        }

        setTechStack(data || []);
      } catch (err) {
        console.error('Error loading tech stack:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechStack();
  }, []);

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
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-slate-600">Loading tech stack...</div>
          </div>
        ) : (
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {techStack.map((tech: any, index: number) => (
                <Card 
                  key={tech.id} 
                  className={`relative hover:shadow-lg transition-all duration-300 hover:scale-105 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {tech.certified && <CertificationIcon certCount={tech.cert_count} />}
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 mb-1 leading-tight">{tech.name}</div>
                    <div className="text-xs text-slate-500 leading-tight">{tech.category}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
