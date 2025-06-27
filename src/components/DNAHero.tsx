import { useEffect, useState } from "react";
import { Dna, Star, ArrowRight } from "lucide-react";
// ✅ Import your local profile image from assets
import profilePic from "@/assets/Tim_Nolan_Profile_Pic_Cropped.jpg";

// Import the data from ProjectTabs - you'll need to export these from your ProjectTabs file
import { projects, caseStudies, dashboards, publications, certifications } from "./ProjectTabs";

export const DNAHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Dynamically find all items with NEW! status
  const getNewItems = () => {
    const newItems = [];
    
    // Check projects
    projects.forEach(project => {
      if (project.status === "NEW!") {
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
      if (study.status === "NEW!") {
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
      if (dashboard.status === "NEW!") {
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
      if (pub.status === "NEW!") {
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
      if (cert.status === "NEW!") {
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

  const scrollToSection = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewItemClick = (item) => {
    // First scroll to the projects section
    scrollToSection('projects');
    
    // Then trigger the appropriate tab with a longer delay to ensure the section is loaded
    setTimeout(() => {
      // Try multiple selectors to find the tabs
      const tabsContainer = document.querySelector('[role="tablist"]') || 
                           document.querySelector('.tabs-list') ||
                           document.querySelector('[data-orientation="horizontal"]');
      
      if (tabsContainer) {
        // Look for the specific tab button
        const tabToClick = tabsContainer.querySelector(`[value="${item.tabValue}"]`) ||
                          tabsContainer.querySelector(`[data-value="${item.tabValue}"]`) ||
                          tabsContainer.querySelector(`button:contains('${item.tabValue}')`);
        
        if (tabToClick) {
          tabToClick.click();
        } else {
          // Fallback: try to find by text content
          const allTabs = tabsContainer.querySelectorAll('button');
          const targetTab = Array.from(allTabs).find(tab => {
            const text = tab.textContent.toLowerCase();
            return text.includes(item.tabValue.replace('-', ' '));
          });
          if (targetTab) {
            targetTab.click();
          }
        }
      }
    }, 800); // Increased delay to ensure smooth scrolling completes
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                <img 
                  src={profilePic} 
                  alt="Timothy Nolan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Timothy Nolan</h1>
                <p className="text-lg text-slate-600">Data & Business Strategy Analyst</p>
                {/* <p className="text-sm text-slate-500">Waltham, MA • Available for work</p> */}
              </div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
              What's in my
              <span className="block text-blue-600">Professional DNA?</span>
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Recent MBA and MS in Business Analytics graduate from Bentley University, with undergraduate degrees in Marketing and Psychology. My background combines business, analytics, and behavioral science, applied in early-stage companies, research, and university-based entrepreneurship programs.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Data Analysis
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Strategic Planning
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Business Intelligence
              </span>
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                Behavioral Science
              </span>
            </div>

            {/* What's New Section - Horizontal layout below skills */}
            {newItems.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">What's New</h3>
                </div>
                {/* Horizontal scrollable container */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {newItems.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => handleNewItemClick(item)}
                      className="flex-shrink-0 w-64 p-3 bg-white rounded-md hover:bg-blue-50 cursor-pointer transition-colors group border border-gray-100 hover:border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {item.type}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <h4 className="text-sm font-medium text-slate-800 mb-1 line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Dna className="h-32 w-32 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-blue-300 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
