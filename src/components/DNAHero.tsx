import { useEffect, useState, useCallback } from "react";
import { Dna, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import profilePic from "@/assets/Tim_Nolan_Profile_Pic_Cropped.jpg";
import { 
  fetchProjects, 
  fetchCaseStudies, 
  fetchDashboards, 
  fetchPublications, 
  fetchCertifications 
} from "@/api/projectApi";

export const DNAHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNewItemIndex, setCurrentNewItemIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [easterEggFound, setEasterEggFound] = useState(false);
  const [showEgg, setShowEgg] = useState(false);
  
  // State for all data sections
  const [projects, setProjects] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [publications, setPublications] = useState([]);
  const [certifications, setCertifications] = useState([]);
  
  // Loading states
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [caseStudiesLoading, setCaseStudiesLoading] = useState(true);
  const [dashboardsLoading, setDashboardsLoading] = useState(true);
  const [publicationsLoading, setPublicationsLoading] = useState(true);
  const [certificationsLoading, setCertificationsLoading] = useState(true);
  
  // Error states
  const [projectsError, setProjectsError] = useState(null);
  const [caseStudiesError, setCaseStudiesError] = useState(null);
  const [dashboardsError, setDashboardsError] = useState(null);
  const [publicationsError, setPublicationsError] = useState(null);
  const [certificationsError, setCertificationsError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjectsLoading(true);
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
        setProjectsError(null);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjectsError(error.message);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Fetch case studies from API
  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        setCaseStudiesLoading(true);
        const fetchedCaseStudies = await fetchCaseStudies();
        setCaseStudies(fetchedCaseStudies);
        setCaseStudiesError(null);
      } catch (error) {
        console.error('Error loading case studies:', error);
        setCaseStudiesError(error.message);
        setCaseStudies([]);
      } finally {
        setCaseStudiesLoading(false);
      }
    };

    loadCaseStudies();
  }, []);

  // Fetch dashboards from API
  useEffect(() => {
    const loadDashboards = async () => {
      try {
        setDashboardsLoading(true);
        const fetchedDashboards = await fetchDashboards();
        setDashboards(fetchedDashboards);
        setDashboardsError(null);
      } catch (error) {
        console.error('Error loading dashboards:', error);
        setDashboardsError(error.message);
        setDashboards([]);
      } finally {
        setDashboardsLoading(false);
      }
    };

    loadDashboards();
  }, []);

  // Fetch publications from API
  useEffect(() => {
    const loadPublications = async () => {
      try {
        setPublicationsLoading(true);
        const fetchedPublications = await fetchPublications();
        setPublications(fetchedPublications);
        setPublicationsError(null);
      } catch (error) {
        console.error('Error loading publications:', error);
        setPublicationsError(error.message);
        setPublications([]);
      } finally {
        setPublicationsLoading(false);
      }
    };

    loadPublications();
  }, []);

  // Fetch certifications from API
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setCertificationsLoading(true);
        const fetchedCertifications = await fetchCertifications();
        setCertifications(fetchedCertifications);
        setCertificationsError(null);
      } catch (error) {
        console.error('Error loading certifications:', error);
        setCertificationsError(error.message);
        setCertifications([]);
      } finally {
        setCertificationsLoading(false);
      }
    };

    loadCertifications();
  }, []);

  const getNewItems = useCallback(() => {
    const newItems = [];
    
    // Add projects from API
    projects.forEach(project => {
      if (project.status === "NEW!") {
        newItems.push({ 
          title: project.title, 
          type: "Project", 
          description: project.description ? project.description.slice(0, 60) + "..." : "No description available", 
          tabValue: "projects" 
        });
      }
    });

    // Add case studies from API
    caseStudies.forEach(study => {
      if (study.status === "NEW!") {
        newItems.push({ 
          title: study.title, 
          type: "Case Study", 
          description: study.description ? study.description.slice(0, 60) + "..." : "No description available", 
          tabValue: "case-studies" 
        });
      }
    });

    // Add dashboards from API
    dashboards.forEach(dashboard => {
      if (dashboard.status === "NEW!") {
        newItems.push({ 
          title: dashboard.title, 
          type: "Dashboard", 
          description: dashboard.description ? dashboard.description.slice(0, 60) + "..." : "No description available", 
          tabValue: "dashboards" 
        });
      }
    });

    // Add publications from API
    publications.forEach(pub => {
      if (pub.status === "NEW!") {
        newItems.push({ 
          title: pub.title, 
          type: "Publication", 
          description: pub.journal ? `${pub.journal} • ${pub.year}` : `Published ${pub.year}`, 
          tabValue: "publications" 
        });
      }
    });

    // Add certifications from API
    certifications.forEach(cert => {
      if (cert.status === "NEW!") {
        newItems.push({ 
          title: cert.title, 
          type: "Certification", 
          description: cert.issuer ? `${cert.issuer} • ${cert.year}` : `Issued ${cert.year}`, 
          tabValue: "certifications" 
        });
      }
    });

    return newItems;
  }, [projects, caseStudies, dashboards, publications, certifications]);

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

  // Check if any data is still loading
  const isLoading = projectsLoading || caseStudiesLoading || dashboardsLoading || publicationsLoading || certificationsLoading;
  
  // Check if there are any errors
  const hasErrors = projectsError || caseStudiesError || dashboardsError || publicationsError || certificationsError;
  
  // Combine all error messages
  const errorMessages = [projectsError, caseStudiesError, dashboardsError, publicationsError, certificationsError].filter(Boolean);

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

            {/* Show loading state */}
            {isLoading && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-5 w-5 text-blue-600 animate-pulse" />
                  <h3 className="text-base md:text-lg font-semibold text-slate-800">Loading Updates...</h3>
                </div>
                <div className="bg-white rounded-md p-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            )}

            {/* Show error state */}
            {!isLoading && hasErrors && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-5 w-5 text-red-600" />
                  <h3 className="text-base md:text-lg font-semibold text-slate-800">Unable to Load Some Data</h3>
                </div>
                <div className="space-y-1">
                  {errorMessages.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Show new items when not loading and no errors */}
            {!isLoading && !hasErrors && newItems.length > 0 && (
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

            {/* Show message when no new items and not loading */}
            {!isLoading && !hasErrors && newItems.length === 0 && (
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-slate-600" />
                  <h3 className="text-base md:text-lg font-semibold text-slate-800">Portfolio Loaded</h3>
                </div>
                <p className="text-sm text-slate-600 mt-2">Explore my complete portfolio below to see all projects and work.</p>
              </div>
            )}
          </div>

          <div className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative cursor-default" onClick={handleDnaClick}>
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {showEgg ? (
                  <div className="text-6xl sm:text-7xl md:text-8xl animate-bounce">🥚</div>
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
