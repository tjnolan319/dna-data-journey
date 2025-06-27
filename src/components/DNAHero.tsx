
import { useEffect, useState, useCallback, useRef } from "react";
import { Dna, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import profilePic from "@/assets/Tim_Nolan_Profile_Pic_Cropped.jpg";
import { projects, caseStudies, dashboards, publications, certifications } from "./ProjectTabs";

export const DNAHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNewItemIndex, setCurrentNewItemIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getNewItems = () => {
    const newItems = [];

    projects.forEach(project => {
      if ('status' in project && project.status === "NEW!") {
        newItems.push({ title: project.title, type: "Project", description: project.description, tabValue: "projects" });
      }
    });
    caseStudies.forEach(study => {
      if ('status' in study && study.status === "NEW!") {
        newItems.push({ title: study.title, type: "Case Study", description: study.description, tabValue: "case-studies" });
      }
    });
    dashboards.forEach(dashboard => {
      if ('status' in dashboard && dashboard.status === "NEW!") {
        newItems.push({ title: dashboard.title, type: "Dashboard", description: dashboard.description, tabValue: "dashboards" });
      }
    });
    publications.forEach(pub => {
      if ('status' in pub && pub.status === "NEW!") {
        newItems.push({ title: pub.title, type: "Publication", description: `${pub.journal} • ${pub.year}`, tabValue: "publications" });
      }
    });
    certifications.forEach(cert => {
      if ('status' in cert && cert.status === "NEW!") {
        newItems.push({ title: cert.title, type: "Certification", description: `${cert.issuer} • ${cert.year}`, tabValue: "certifications" });
      }
    });

    return newItems;
  };

  const newItems = getNewItems();

  const clearAutoSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const scheduleNextSlide = useCallback(() => {
    clearAutoSlide();
    if (newItems.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentNewItemIndex((prev) => (prev + 1) % newItems.length);
      }, 8000);
    }
  }, [newItems.length]);

  useEffect(() => {
    scheduleNextSlide();
    return clearAutoSlide;
  }, [currentNewItemIndex, scheduleNextSlide]);

  const nextItem = () => setCurrentNewItemIndex((prev) => (prev + 1) % newItems.length);
  const prevItem = () => setCurrentNewItemIndex((prev) => (prev - 1 + newItems.length) % newItems.length);
  const goToItem = (index) => setCurrentNewItemIndex(index);

  const scrollToSection = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewItemClick = (item) => {
    scrollToSection('projects');
    setTimeout(() => {
      const tabEvent = new CustomEvent('switchTab', { detail: { tabValue: item.tabValue } });
      window.dispatchEvent(tabEvent);
      setTimeout(() => {
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
    <section id="hero" className="min-h-[70vh] md:min-h-[85vh] flex items-center justify-center pt-12 pb-6 md:pt-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center">
          <div className={`space-y-2 sm:space-y-3 md:space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3 md:mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto sm:mx-0 rounded-full overflow-hidden border-3 border-blue-200 shadow-lg flex-shrink-0">
                <img src={profilePic} alt="Timothy Nolan" className="w-full h-full object-cover" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Timothy Nolan</h1>
                <p className="text-sm sm:text-base text-slate-600">Data & Business Strategy Analyst</p>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight text-center sm:text-left">
              What's in my <span className="block text-blue-600">Professional DNA?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center sm:text-left">
              Recent MBA and MS in Business Analytics graduate from Bentley University, with undergraduate degrees in Marketing and Psychology. My background combines business, analytics, and behavioral science, applied in early-stage companies, research, and university-based entrepreneurship programs.
            </p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 justify-center sm:justify-start">
              <span className="px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Data Analysis</span>
              <span className="px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">Strategic Planning</span>
              <span className="px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Business Intelligence</span>
              <span className="px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Behavioral Science</span>
            </div>
            {newItems.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 sm:p-2.5 md:p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800">What's New</h3>
                  </div>
                  {newItems.length > 1 && (
                    <div className="flex items-center space-x-1">
                      <button onClick={prevItem} className="p-0.5 sm:p-1 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors" aria-label="Previous item">
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-slate-500 min-w-0">
                        {currentNewItemIndex + 1} / {newItems.length}
                      </span>
                      <button onClick={nextItem} className="p-0.5 sm:p-1 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors" aria-label="Next item">
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative overflow-hidden">
                  <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentNewItemIndex * 100}%)` }}>
                    {newItems.map((item, index) => (
                      <div key={index} onClick={() => handleNewItemClick(item)} className="w-full flex-shrink-0 p-1.5 sm:p-2 bg-white rounded-md hover:bg-blue-50 cursor-pointer transition-colors group border border-gray-100 hover:border-blue-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">{item.type}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <h4 className="text-xs font-medium text-slate-800 mb-0.5 line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {newItems.length > 1 && (
                  <div className="flex justify-center space-x-1 mt-1.5 sm:mt-2">
                    {newItems.map((_, index) => (
                      <button key={index} onClick={() => goToItem(index)} className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentNewItemIndex ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'}`} aria-label={`Go to item ${index + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Dna className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-18 h-18 sm:w-24 sm:h-24 md:w-30 md:h-30 lg:w-36 lg:h-36 border-3 border-blue-300 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
