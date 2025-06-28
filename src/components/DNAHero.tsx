
import { useEffect, useState, useCallback } from "react";
import { Dna, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
// ✅ Import your local profile image from assets
import profilePic from "@/assets/Tim_Nolan_Profile_Pic_Cropped.jpg";

// Import the data from ProjectTabs - you'll need to export these from your ProjectTabs file
import { projects, caseStudies, dashboards, publications, certifications } from "./ProjectTabs";

export const DNAHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNewItemIndex, setCurrentNewItemIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Dynamically find all items with NEW! status
  const getNewItems = () => {
    const newItems = [];
    
    // Check projects
    projects.forEach(project => {
      if ('status' in project && project.status === "NEW!") {
        newItems.push({
          title: project.title,
          type: "Project",
          description: project.description,
          tabValue: "projects"
        });
      }
    });

    // Check case studies
    caseStudies.forEach(study => {
      if ('status' in study && study.status === "NEW!") {
        newItems.push({
          title: study.title,
          type: "Case Study",
          description: study.description,
          tabValue: "case-studies"
        });
      }
    });

    // Check dashboards
    dashboards.forEach(dashboard => {
      if ('status' in dashboard && dashboard.status === "NEW!") {
        newItems.push({
          title: dashboard.title,
          type: "Dashboard", 
          description: dashboard.description,
          tabValue: "dashboards"
        });
      }
    });

    // Check publications
    publications.forEach(pub => {
      if ('status' in pub && pub.status === "NEW!") {
        newItems.push({
          title: pub.title,
          type: "Publication",
          description: `${pub.journal} • ${pub.year}`,
          tabValue: "publications"
        });
      }
    });

    // Check certifications
    certifications.forEach(cert => {
      if ('status' in cert && cert.status === "NEW!") {
        newItems.push({
          title: cert.title,
          type: "Certification",
          description: `${cert.issuer} • ${cert.year}`,
          tabValue: "certifications"
        });
      }
    });

    return newItems;
  };

  const newItems = getNewItems();

  // Auto-slide effect for What's New carousel with reset capability
  const resetAutoSlide = useCallback(() => {
    if (newItems.length > 1) {
      return setInterval(() => {
        setCurrentNewItemIndex((prev) => (prev + 1) % newItems.length);
      }, 4000); // Change every 4 seconds
    }
    return null;
  }, [newItems.length]);

  useEffect(() => {
    const interval = resetAutoSlide();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resetAutoSlide]);

  const nextItem = () => {
    setCurrentNewItemIndex((prev) => (prev + 1) % newItems.length);
  };

  const prevItem = () => {
    setCurrentNewItemIndex((prev) => (prev - 1 + newItems.length) % newItems.length);
  };

  const goToItem = (index) => {
    setCurrentNewItemIndex(index);
  };

  const scrollToSection = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewItemClick = (item) => {
    // First scroll to the projects section
    scrollToSection('projects');
    
    // Then trigger the appropriate tab with multiple attempts
    setTimeout(() => {
      // Direct approach - trigger a custom event that the ProjectTabs component can listen for
      const tabEvent = new CustomEvent('switchTab', { 
        detail: { tabValue: item.tabValue }
      });
      window.dispatchEvent(tabEvent);
      
      // Fallback approach - try DOM manipulation
      setTimeout(() => {
        // Try different ways to find and click the tab
        const attempts = [
          () => {
            const element = document.querySelector(`[data-state="inactive"][value="${item.tabValue}"]`) as HTMLElement;
            if (element) {
              element.click();
              return true;
            }
            return false;
          },
          () => {
            const element = document.querySelector(`button[value="${item.tabValue}"]`) as HTMLElement;
            if (element) {
              element.click();
              return true;
            }
            return false;
          },
          () => {
            const element = document.querySelector(`[role="tab"][data-value="${item.tabValue}"]`) as HTMLElement;
            if (element) {
              element.click();
              return true;
            }
            return false;
          },
          () => {
            const allTabs = document.querySelectorAll('[role="tab"]');
            const targetTab = Array.from(allTabs).find(tab => 
              tab.getAttribute('value') === item.tabValue || 
              tab.getAttribute('data-value') === item.tabValue
            ) as HTMLElement;
            if (targetTab) {
              targetTab.click();
              return true;
            }
            return false;
          }
        ];
        
        for (const attempt of attempts) {
          try {
            if (attempt()) break;
          } catch (e) {
            console.log('Tab click attempt failed:', e);
          }
        }
      }, 200);
    }, 800);
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16 md:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className={`space-y-4 sm:space-y-5 md:space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto sm:mx-0 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg flex-shrink-0">
                <img 
                  src={profilePic} 
                  alt="Timothy Nolan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Timothy Nolan</h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-600">Data & Business Strategy Analyst</p>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight text-center sm:text-left px-2 sm:px-0">
              What's in my
              <span className="block text-blue-600">Professional DNA?</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed text-center sm:text-left px-2 sm:px-0">
              Recent MBA and MS in Business Analytics graduate from Bentley University, with undergraduate degrees in Marketing and Psychology. My background combines business, analytics, and behavioral science, applied in early-stage companies, research, and university-based entrepreneurship programs.
            </p>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start px-2 sm:px-0">
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                Data Analysis
              </span>
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
                Strategic Planning
              </span>
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                Business Intelligence
              </span>
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium">
                Behavioral Science
              </span>
            </div>

            {/* What's New Section - Carousel style */}
            {newItems.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 border border-blue-200 mx-2 sm:mx-0">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">What's New</h3>
                  </div>
                  {newItems.length > 1 && (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={prevItem}
                        className="p-1 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                        aria-label="Previous item"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <span className="text-xs text-slate-500 min-w-0">
                        {currentNewItemIndex + 1} / {newItems.length}
                      </span>
                      <button
                        onClick={nextItem}
                        className="p-1 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                        aria-label="Next item"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Carousel container */}
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentNewItemIndex * 100}%)` }}
                  >
                    {newItems.map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => handleNewItemClick(item)}
                        className="w-full flex-shrink-0 p-2 sm:p-3 bg-white rounded-md hover:bg-blue-50 cursor-pointer transition-colors group border border-gray-100 hover:border-blue-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {item.type}
                          </span>
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-medium text-slate-800 mb-1 line-clamp-2 leading-tight">{item.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-tight">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Dots indicator */}
                {newItems.length > 1 && (
                  <div className="flex justify-center space-x-1 sm:space-x-2 mt-2 sm:mt-3">
                    {newItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToItem(index)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                          index === currentNewItemIndex 
                            ? 'bg-blue-600' 
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Go to item ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Dna className="h-18 w-18 sm:h-22 sm:w-22 md:h-28 md:w-28 lg:h-32 lg:w-32 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-42 md:h-42 lg:w-48 lg:w-48 border-4 border-blue-300 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
