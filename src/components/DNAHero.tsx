import { useEffect, useState, useCallback } from "react";
import { Dna, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import profilePic from "@/assets/Tim_Nolan_Profile_Pic_Cropped.jpg";
import { projects, caseStudies, dashboards, publications, certifications } from "./ProjectTabs";

export const DNAHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNewItemIndex, setCurrentNewItemIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [easterEggFound, setEasterEggFound] = useState(false);
  const [showEgg, setShowEgg] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getNewItems = () => {
    const newItems = [];
    projects.forEach(project => {
      if (project.status === "NEW!") {
        newItems.push({ title: project.title, type: "Project", description: project.description.slice(0, 60) + "...", tabValue: "projects" });
      }
    });
    caseStudies.forEach(study => {
      if (study.status === "NEW!") {
        newItems.push({ title: study.title, type: "Case Study", description: study.description.slice(0, 60) + "...", tabValue: "case-studies" });
      }
    });
    dashboards.forEach(dashboard => {
      if (dashboard.status === "NEW!") {
        newItems.push({ title: dashboard.title, type: "Dashboard", description: dashboard.description.slice(0, 60) + "...", tabValue: "dashboards" });
      }
    });
    publications.forEach(pub => {
      if (pub.status === "NEW!") {
        newItems.push({ title: pub.title, type: "Publication", description: `${pub.journal} • ${pub.year}`, tabValue: "publications" });
      }
    });
    certifications.forEach(cert => {
      if (cert.status === "NEW!") {
        newItems.push({ title: cert.title, type: "Certification", description: `${cert.issuer} • ${cert.year}`, tabValue: "certifications" });
      }
    });
    return newItems;
  };

  const newItems = getNewItems();

  const resetAutoSlide = useCallback(() => {
    if (newItems.length > 1) {
      return setInterval(() => {
        setCurrentNewItemIndex(prev => (prev + 1) % newItems.length);
      }, 4000);
    }
    return null;
  }, [newItems.length]);

  useEffect(() => {
    const interval = resetAutoSlide();
    return () => interval && clearInterval(interval);
  }, [resetAutoSlide]);

  const nextItem = () => setCurrentNewItemIndex(prev => (prev + 1) % newItems.length);
  const prevItem = () => setCurrentNewItemIndex(prev => (prev - 1 + newItems.length) % newItems.length);
  const goToItem = index => setCurrentNewItemIndex(index);

  const scrollToSection = target => {
    const element = document.getElementById(target);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewItemClick = item => {
    scrollToSection('projects');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('switchTab', { detail: { tabValue: item.tabValue } }));
      setTimeout(() => {
        const attempts = [
          () => document.querySelector(`[data-state="inactive"][value="${item.tabValue}"]`),
          () => document.querySelector(`button[value="${item.tabValue}"]`),
          () => document.querySelector(`[role="tab"][data-value="${item.tabValue}"]`),
          () => [...document.querySelectorAll('[role="tab"]')].find(tab => tab.getAttribute('value') === item.tabValue || tab.getAttribute('data-value') === item.tabValue),
        ];
        for (const tryTab of attempts) {
          const el = tryTab();
          if (el instanceof HTMLElement) {
            el.click();
            break;
          }
        }
      }, 200);
    }, 800);
  };

  const handleDnaClick = () => {
    setClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount === 13 && !easterEggFound) {
        setEasterEggFound(true);
        setShowEgg(true);
        // Hide the easter egg after 5 seconds
        setTimeout(() => {
          setShowEgg(false);
          setEasterEggFound(false);
        }, 5000);
      }
      return nextCount;
    });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16 md:pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center items-center sm:space-x-4 mb-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                <img src={profilePic} alt="Timothy Nolan" className="w-full h-full object-cover" />
              </div>
              <div className="text-center sm:text-left mt-4 sm:mt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Timothy Nolan</h1>
                <p className="text-base md:text-lg text-slate-600 mt-1">Data & Business Strategy Analyst</p>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight text-center sm:text-left">
              What's in my <span className="block text-blue-600">Professional DNA?</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed text-center sm:text-left">
              Recent MBA & MS Business Analytics graduate from Bentley University. I combine business strategy, data analytics, and behavioral science in early-stage companies and research environments.
            </p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {['Data Analysis', 'Strategic Planning', 'Business Intelligence', 'Behavioral Science'].map((text, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800'][i]
                  }`}
                >{text}</span>
              ))}
            </div>

            {newItems.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    <h3 className="text-base md:text-lg font-semibold text-slate-800">Latest Updates</h3>
                  </div>
                  {newItems.length > 1 && (
                    <div className="flex items-center space-x-1">
                      <button onClick={prevItem} className="p-1.5 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-slate-500 px-2">{currentNewItemIndex + 1} / {newItems.length}</span>
                      <button onClick={nextItem} className="p-1.5 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative overflow-hidden">
                  <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentNewItemIndex * 100}%)` }}>
                    {newItems.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleNewItemClick(item)}
                        className="w-full flex-shrink-0 p-3 bg-white rounded-md hover:bg-blue-50 cursor-pointer group border hover:border-blue-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{item.type}</span>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <h4 className="text-sm font-medium text-slate-800 mb-1 line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {newItems.length > 1 && (
                  <div className="flex justify-center space-x-1 mt-3">
                    {newItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToItem(index)}
                        className={`w-2 h-2 rounded-full ${index === currentNewItemIndex ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative cursor-default" onClick={handleDnaClick}>
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {showEgg ? (
                  <svg 
                    className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:w-32 lg:h-32 animate-bounce" 
                    viewBox="0 0 200 240" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Egg base shape */}
                    <ellipse cx="100" cy="160" rx="60" ry="80" fill="url(#eggGradient)" stroke="#e2e8f0" strokeWidth="2"/>
                    
                    {/* Decorative patterns */}
                    {/* Top zigzag band */}
                    <path d="M50 120 L60 110 L70 120 L80 110 L90 120 L100 110 L110 120 L120 110 L130 120 L140 110 L150 120" 
                          stroke="#ec4899" strokeWidth="3" fill="none"/>
                    
                    {/* Middle diamond pattern */}
                    <polygon points="100,140 110,150 100,160 90,150" fill="#8b5cf6"/>
                    <polygon points="80,150 90,160 80,170 70,160" fill="#3b82f6"/>
                    <polygon points="120,150 130,160 120,170 110,160" fill="#10b981"/>
                    
                    {/* Bottom wavy pattern */}
                    <path d="M60 180 Q70 175 80 180 T100 180 T120 180 T140 180" 
                          stroke="#f59e0b" strokeWidth="3" fill="none"/>
                    
                    {/* Small decorative dots */}
                    <circle cx="85" cy="135" r="3" fill="#ec4899"/>
                    <circle cx="115" cy="135" r="3" fill="#ec4899"/>
                    <circle cx="75" cy="190" r="2" fill="#8b5cf6"/>
                    <circle cx="100" cy="195" r="2" fill="#3b82f6"/>
                    <circle cx="125" cy="190" r="2" fill="#10b981"/>
                    
                    {/* Flower pattern on sides */}
                    <g transform="translate(65, 165)">
                      <circle cx="0" cy="0" r="6" fill="#fbbf24"/>
                      <circle cx="-4" cy="-4" r="3" fill="#f59e0b"/>
                      <circle cx="4" cy="-4" r="3" fill="#f59e0b"/>
                      <circle cx="4" cy="4" r="3" fill="#f59e0b"/>
                      <circle cx="-4" cy="4" r="3" fill="#f59e0b"/>
                    </g>
                    
                    <g transform="translate(135, 165)">
                      <circle cx="0" cy="0" r="6" fill="#fbbf24"/>
                      <circle cx="-4" cy="-4" r="3" fill="#f59e0b"/>
                      <circle cx="4" cy="-4" r="3" fill="#f59e0b"/>
                      <circle cx="4" cy="4" r="3" fill="#f59e0b"/>
                      <circle cx="-4" cy="4" r="3" fill="#f59e0b"/>
                    </g>
                    
                    {/* Shine effect */}
                    <ellipse cx="85" cy="140" rx="8" ry="15" fill="white" opacity="0.3"/>
                    
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="eggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#fef3c7', stopOpacity:1}} />
                        <stop offset="50%" style={{stopColor:'#fde68a', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#f59e0b', stopOpacity:0.8}} />
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  <Dna className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:w-32 lg:h-32 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-42 md:h-42 lg:w-48 lg:h-48 border-4 border-blue-300 rounded-full animate-ping opacity-30"></div>
              </div>
              {showEgg && (
                <div className="absolute top-full mt-2 text-center w-full text-sm text-pink-600 font-semibold animate-bounce">
                  You found an easter egg!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
