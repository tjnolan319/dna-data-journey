import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, FlaskConical, BookOpen, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  fetchProjects, 
  fetchCaseStudies, 
  fetchDashboards, 
  fetchPublications, 
  fetchCertifications,
  fetchLabNotes
} from "../api/projectApi"; // Import your API functions

const StatusBanner = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "NEW!":
        return "bg-blue-600 text-white";
      case "IN PROGRESS":
        return "bg-orange-500 text-white";
      case "UNDER CONSTRUCTION":
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold z-10 ${getStatusStyles(status)}`}>
      {status}
    </div>
  );
};

const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <span className="ml-2 text-slate-600">{message}</span>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-12">
    <p className="text-red-600 mb-4">Error loading data: {message}</p>
    <Button onClick={onRetry} variant="outline">
      Retry
    </Button>
  </div>
);

export const ProjectTabs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  
  // State for all data sections
  const [projects, setProjects] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [publications, setPublications] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [labNotesCount, setLabNotesCount] = useState(0);
  const [isLoadingLabNotes, setIsLoadingLabNotes] = useState(true);
  const [labNotesError, setLabNotesError] = useState(null);

  
  // Loading states
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingCaseStudies, setIsLoadingCaseStudies] = useState(true);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(true);
  const [isLoadingPublications, setIsLoadingPublications] = useState(true);
  const [isLoadingCertifications, setIsLoadingCertifications] = useState(true);
  
  // Error states
  const [projectsError, setProjectsError] = useState(null);
  const [caseStudiesError, setCaseStudiesError] = useState(null);
  const [dashboardsError, setDashboardsError] = useState(null);
  const [publicationsError, setPublicationsError] = useState(null);
  const [certificationsError, setCertificationsError] = useState(null);

  // Fetch projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        setProjectsError(null);
      } catch (err) {
        setProjectsError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  // Fetch case studies from API
  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        setIsLoadingCaseStudies(true);
        const caseStudiesData = await fetchCaseStudies();
        setCaseStudies(caseStudiesData);
        setCaseStudiesError(null);
      } catch (err) {
        setCaseStudiesError(err.message);
        console.error('Error fetching case studies:', err);
      } finally {
        setIsLoadingCaseStudies(false);
      }
    };

    loadCaseStudies();
  }, []);

  // Fetch dashboards from API
  useEffect(() => {
    const loadDashboards = async () => {
      try {
        setIsLoadingDashboards(true);
        const dashboardsData = await fetchDashboards();
        setDashboards(dashboardsData);
        setDashboardsError(null);
      } catch (err) {
        setDashboardsError(err.message);
        console.error('Error fetching dashboards:', err);
      } finally {
        setIsLoadingDashboards(false);
      }
    };

    loadDashboards();
  }, []);

  // Fetch publications from API
  useEffect(() => {
    const loadPublications = async () => {
      try {
        setIsLoadingPublications(true);
        const publicationsData = await fetchPublications();
        setPublications(publicationsData);
        setPublicationsError(null);
      } catch (err) {
        setPublicationsError(err.message);
        console.error('Error fetching publications:', err);
      } finally {
        setIsLoadingPublications(false);
      }
    };

    loadPublications();
  }, []);

  // Fetch certifications from API
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setIsLoadingCertifications(true);
        const certificationsData = await fetchCertifications();
        setCertifications(certificationsData);
        setCertificationsError(null);
      } catch (err) {
        setCertificationsError(err.message);
        console.error('Error fetching certifications:', err);
      } finally {
        setIsLoadingCertifications(false);
      }
    };

    loadCertifications();
  }, []);

  // Listen for tab switch events from the hero section
  useEffect(() => {
    const handleTabSwitch = (event) => {
      if (event.detail && event.detail.tabValue) {
        setActiveTab(event.detail.tabValue);
        
        // Handle item highlighting if specified
        if (event.detail.highlightItemId) {
          setHighlightedItemId(event.detail.highlightItemId);
          
          // Remove highlight after 2.5 seconds
          setTimeout(() => {
            setHighlightedItemId(null);
          }, 2500);
        }
      }
    };

    window.addEventListener('switchTab', handleTabSwitch);
    
    return () => {
      window.removeEventListener('switchTab', handleTabSwitch);
    };
  }, []);

    useEffect(() => {
    const loadLabNotes = async () => {
      try {
        setIsLoadingLabNotes(true);
        const labNotes = await fetchLabNotes();
        setLabNotesCount(labNotes.length);
        setLabNotesError(null);
      } catch (err) {
        setLabNotesError(err.message);
        console.error('Error fetching lab notes:', err);
      } finally {
        setIsLoadingLabNotes(false);
      }
    };

    loadLabNotes();
  }, []);


  const handleProjectClick = (project) => {
    if (project.slug) {
      navigate(`/${project.slug}`);
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleDashboardClick = (dashboard) => {
  if (dashboard.slug) {
    navigate(`/${dashboard.slug}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
};


  // Keep the static data for lab notes only
  const labNotes = [
    {
      title: "Lab Notes",
      subtitle: "The Analytical Notebook (coming soon!)",
      description: "Deep dives into my professional methodology, case studies, and analytical frameworks. Where curiosity meets systematic investigation.",
      entries: labNotesCount,
      status: "Recently updated"
    }
  ];

  // Lab Notes navigation handler
  const handleViewLabNotes = () => {
    navigate('/lab-notes');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Retry functions
  const retryProjects = () => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        setProjectsError(null);
      } catch (err) {
        setProjectsError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    loadProjects();
  };

  const retryCaseStudies = () => {
    const loadCaseStudies = async () => {
      try {
        setIsLoadingCaseStudies(true);
        const caseStudiesData = await fetchCaseStudies();
        setCaseStudies(caseStudiesData);
        setCaseStudiesError(null);
      } catch (err) {
        setCaseStudiesError(err.message);
        console.error('Error fetching case studies:', err);
      } finally {
        setIsLoadingCaseStudies(false);
      }
    };
    loadCaseStudies();
  };

  const retryDashboards = () => {
    const loadDashboards = async () => {
      try {
        setIsLoadingDashboards(true);
        const dashboardsData = await fetchDashboards();
        setDashboards(dashboardsData);
        setDashboardsError(null);
      } catch (err) {
        setDashboardsError(err.message);
        console.error('Error fetching dashboards:', err);
      } finally {
        setIsLoadingDashboards(false);
      }
    };
    loadDashboards();
  };

  const retryPublications = () => {
    const loadPublications = async () => {
      try {
        setIsLoadingPublications(true);
        const publicationsData = await fetchPublications();
        setPublications(publicationsData);
        setPublicationsError(null);
      } catch (err) {
        setPublicationsError(err.message);
        console.error('Error fetching publications:', err);
      } finally {
        setIsLoadingPublications(false);
      }
    };
    loadPublications();
  };

  const retryCertifications = () => {
    const loadCertifications = async () => {
      try {
        setIsLoadingCertifications(true);
        const certificationsData = await fetchCertifications();
        setCertifications(certificationsData);
        setCertificationsError(null);
      } catch (err) {
        setCertificationsError(err.message);
        console.error('Error fetching certifications:', err);
      } finally {
        setIsLoadingCertifications(false);
      }
    };
    loadCertifications();
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">
          My Professional <span className="text-blue-600">Portfolio</span>
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 max-w-5xl mx-auto mb-8 h-auto gap-1 p-1">
            <TabsTrigger value="projects" className="text-xs sm:text-sm py-2 px-2">Projects</TabsTrigger>
            <TabsTrigger value="case-studies" className="text-xs sm:text-sm py-2 px-2">Case Studies</TabsTrigger>
            <TabsTrigger value="dashboards" className="text-xs sm:text-sm py-2 px-2">Dashboards</TabsTrigger>
            <TabsTrigger value="publications" className="text-xs sm:text-sm py-2 px-2">Publications</TabsTrigger>
            <TabsTrigger value="certifications" className="text-xs sm:text-sm py-2 px-2">Certifications</TabsTrigger>
            <TabsTrigger value="lab-notes" className="text-xs sm:text-sm py-2 px-2">Lab Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {isLoadingProjects ? (
              <LoadingSpinner message="Loading projects..." />
            ) : projectsError ? (
              <ErrorMessage message={projectsError} onRetry={retryProjects} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {projects.map((project, index) => (
                  <Card 
                    key={project.id || index} 
                    className={`relative hover:shadow-lg transition-shadow ${
                      highlightedItemId && (highlightedItemId === project.id || highlightedItemId === project.title) 
                        ? 'portfolio-highlight' 
                        : ''
                    }`}
                  >
                    {project.status && <StatusBanner status={project.status} />}
                    <CardHeader className={`${project.status ? 'pt-16' : 'pt-6'}`}>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-slate-700 mb-2">Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {(project.tech || []).map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium text-green-600 mb-2">{project.impact}</p>
                          {project.slug && (
                            <Button
                              onClick={() => handleProjectClick(project)}
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-2"
                            >
                              <span>View Details</span>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-6">
            {isLoadingCaseStudies ? (
              <LoadingSpinner message="Loading case studies..." />
            ) : caseStudiesError ? (
              <ErrorMessage message={caseStudiesError} onRetry={retryCaseStudies} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {caseStudies.map((study, index) => (
                  <Card 
                    key={study.id || index} 
                    className={`relative hover:shadow-lg transition-shadow ${
                      highlightedItemId && (highlightedItemId === study.id || highlightedItemId === study.title) 
                        ? 'portfolio-highlight' 
                        : ''
                    }`}
                  >
                    {study.status && <StatusBanner status={study.status} />}
                    <CardHeader className={`${study.status ? 'pt-16' : 'pt-6'}`}>
                      <CardTitle className="text-lg">{study.title}</CardTitle>
                      <CardDescription>{study.industry}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-3">{study.description}</p>
                      <p className="text-sm font-medium text-green-600">{study.impact}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboards" className="space-y-6">
            {isLoadingDashboards ? (
              <LoadingSpinner message="Loading dashboards..." />
            ) : dashboardsError ? (
              <ErrorMessage message={dashboardsError} onRetry={retryDashboards} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {dashboards.map((dashboard, index) => (
                  <Card 
                    key={dashboard.id || index} 
                    className={`relative hover:shadow-lg transition-shadow ${
                      highlightedItemId && (highlightedItemId === dashboard.id || highlightedItemId === dashboard.title) 
                        ? 'portfolio-highlight' 
                        : ''
                    }`}
                  >
                    {dashboard.status && <StatusBanner status={dashboard.status} />}
                    <CardHeader className={`${dashboard.status ? 'pt-16' : 'pt-6'}`}>
                      <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                      <CardDescription>{dashboard.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-slate-700 mb-2">Tools:</h4>
                          <div className="flex flex-wrap gap-2">
                            {(dashboard.tools || []).map((tool, toolIndex) => (
                              <span key={toolIndex} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium text-green-600 mb-2">{dashboard.impact}</p>
                          {(dashboard.hasDetailPage || dashboard.has_detail_page) && (
                            <Button
                              onClick={() => handleDashboardClick(dashboard)}
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-2"
                            >
                              <span>View Details</span>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="publications" className="space-y-6">
            {isLoadingPublications ? (
              <LoadingSpinner message="Loading publications..." />
            ) : publicationsError ? (
              <ErrorMessage message={publicationsError} onRetry={retryPublications} />
            ) : (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {publications.map((pub, index) => (
                  <Card 
                    key={pub.id || index} 
                    className={`relative hover:shadow-lg transition-shadow ${
                      highlightedItemId && (highlightedItemId === pub.id || highlightedItemId === pub.title) 
                        ? 'portfolio-highlight' 
                        : ''
                    }`}
                  >
                    {pub.status && <StatusBanner status={pub.status} />}
                    <CardHeader className={`${pub.status ? 'pt-16' : 'pt-6'}`}>
                      <CardTitle className="text-lg">{pub.title}</CardTitle>
                      <CardDescription>{pub.journal} • {pub.year}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{pub.description}</p>
                      {pub.link && (
                        <Button
                          onClick={() => window.open(pub.link, '_blank')}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <span>Read Article</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            {isLoadingCertifications ? (
              <LoadingSpinner message="Loading certifications..." />
            ) : certificationsError ? (
              <ErrorMessage message={certificationsError} onRetry={retryCertifications} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {certifications.map((cert, index) => (
                  <Card 
                    key={cert.id || index} 
                    className={`relative hover:shadow-lg transition-shadow ${
                      highlightedItemId && (highlightedItemId === cert.id || highlightedItemId === cert.title) 
                        ? 'portfolio-highlight' 
                        : ''
                    }`}
                  >
                    {cert.status && <StatusBanner status={cert.status} />}
                    <CardHeader className={`${cert.status ? 'pt-16' : 'pt-6'}`}>
                      <CardTitle className="text-lg">{cert.title}</CardTitle>
                      <CardDescription>
                        {cert.issuer} • Issued {cert.year}
                        {cert.expires && ` • Expires ${cert.expires}`}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lab-notes" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              {labNotes.map((note, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={handleViewLabNotes}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FlaskConical className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">{note.title}</h3>
                        <p className="text-sm text-slate-500">{note.subtitle}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleViewLabNotes}
                      className="flex items-center justify-center p-2 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                    </button>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {note.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{note.entries} entries</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{note.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
