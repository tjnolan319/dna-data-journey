
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";

export const DataGallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (error) {
          console.error('Error fetching gallery images:', error);
          return;
        }

        setGalleryImages(data || []);
      } catch (err) {
        console.error('Error loading gallery images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
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

    const element = document.getElementById('data-gallery');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="data-gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Portfolio <span className="text-blue-600">Gallery</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Snapshots of my work, including event leadership, program design, and analytical visuals.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-slate-600">Loading gallery...</div>
          </div>
        ) : (
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {galleryImages.map((image: any, index: number) => (
                  <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/2">
                    <Card className="hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src={image.image_url} 
                            alt={image.title}
                            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-white text-center p-4">
                              <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                              <p className="text-sm">{image.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">{image.title}</h3>
                          <p className="text-slate-600 text-sm">{image.description}</p>
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
        )}
      </div>
    </section>
  );
};
