
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const visualizations = [
  {
    title: "Sales Performance Analytics",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop",
    description: "Interactive dashboard showing quarterly sales trends and forecasting models"
  },
  {
    title: "Customer Journey Mapping",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
    description: "Comprehensive analysis of customer touchpoints and conversion funnels"
  },
  {
    title: "Market Segmentation Analysis",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    description: "Advanced clustering visualization for target market identification"
  },
  {
    title: "Financial Performance Dashboard",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
    description: "Real-time financial KPIs and predictive analytics platform"
  }
];

export const DataGallery = () => {
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

    const element = document.getElementById('data-gallery');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="data-gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Data Visualization <span className="text-blue-600">Gallery</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore my portfolio of interactive dashboards and analytical visualizations that transform complex data into actionable insights
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {visualizations.map((viz, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <Card className="hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={viz.image} 
                          alt={viz.title}
                          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-center p-4">
                            <h3 className="text-lg font-semibold mb-2">{viz.title}</h3>
                            <p className="text-sm">{viz.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{viz.title}</h3>
                        <p className="text-slate-600 text-sm">{viz.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
