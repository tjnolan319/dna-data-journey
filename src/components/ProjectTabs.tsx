import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const projects = [
  {
    title: "Genre-Category Pair Advantages at Academy Awards",
    description: "Data science analysis of Academy Award patterns using statistical methods",
    tech: ["Python", "Statistical Analysis", "Deepnote"],
    impact: "Published research findings",
    hasDetailPage: true,
    status: "NEW!"
  },
  {
    title: "Student Business Program Development (SBC Workflow)",
    description: "Designed and refined the process model for launching a university-backed student-owned business initiative",
    tech: ["BPMN", "Stakeholder Interviews", "Process Design", "Higher Ed Policy Alignment"],
    impact: "Created BPMN diagram to clarify decision points and workflows between student businesses, the university, and external reviewers. Currently being implemented in pilot.",
    hasDetailPage: true
  },
  {
    title: "Telehealth Platform Growth Strategy",
    description: "Strategic scaling of clinical staff and digital marketing initiatives for healthcare startup",
    tech: ["Market Research", "SEO", "Digital Marketing"],
    impact: "Scaled from 0 to 10 clinical staff in 18 months",
    status: "UNDER CONSTRUCTION"
  }
];

const publications = [
  {
    title: "Are my peers impulsive? Normative perceptions of impulsivity and associations with personal impulsivity and alcohol use outcomes",
    journal: "Journal of Substance Use",
    year: "2024",
    description: "Research examining whether individuals perceived their peers' impulsivity as different from their own impulsivity and if perceptions of peers' impulsivity moderated the associations between personal impulsivity and alcohol use and consequences.",
    link: "https://www.tandfonline.com/doi/full/10.1080/14659891.2024.2403061?scroll=top&needAccess=true#abstract"
  }
];

const certifications = [
  {
    title: "Alteryx Designer Cloud Core",
    issuer: "Alteryx",
    year: "2025",
    expires: "2027",
    status: "NEW!"
  },
  {
    title: "Alteryx Foundational Micro-Credential", 
    issuer: "Alteryx",
    year: "2025",
    expires: "2027",
    status: "NEW!"
  },
  {
    title: "Microsoft Office Specialist: Excel Associate",
    issuer: "Microsoft",
    year: "2023",
    expires: null
  },
  {
    title: "Social and Behavioral Responsible Conduct of Research",
    issuer: "CITI Program",
    year: "2023",
    expires: "2026"
  }
];

const caseStudies = [
  {
    title: "Healthcare Startup Digital Transformation",
    description: "Strategic analysis and implementation of digital marketing and operational scaling for telehealth platform",
    industry: "Healthcare Technology",
    impact: "300% growth in clinical staff within 18 months"
  },
  {
    title: "University Entrepreneurship Program Development",
    description: "Market analysis and program design for student-run business initiatives at Bentley University",
    industry: "Education",
    impact: "Increased program engagement by 40%"
  }
];

const dashboards = [
  {
    title: "Interactive Skillset Network Diagram",
    description: "Network visualization mapping skillsets based on GitHub project topics, with automated daily updates",
    tools: ["Python", "D3.js", "GitHub API"],
    impact: "Visual representation for non-technical users",
    hasDetailPage: true,
    status: "NEW!"
  },
  {
    title: "Marketing Performance Analytics Dashboard",
    description: "Interactive dashboard tracking digital marketing campaign performance with real-time KPI monitoring",
    tools: ["Tableau", "Excel", "Google Analytics"],
    impact: "Improved campaign ROI by 25%",
    status: "IN PROGRESS"
  },
  {
    title: "Real-Time River Conditions Tracker",
    description: "Predictive dashboard for kayaking safety and enjoyment based on weather and river flow patterns",
    tools: ["Python", "USGS API", "OpenWeather API", "Tableau"],
    impact: "Improved paddle planning with risk scores for multiple locations",
    status: "IN PROGRESS"
  }
];

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

export const ProjectTabs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  // Listen for tab switch events from the hero section
  useEffect(() => {
    const handleTabSwitch = (event) => {
      if (event.detail && event.detail.tabValue) {
        setActiveTab(event.detail.tabValue);
      }
    };

    window.addEventListener('switchTab', handleTabSwitch);
    
    return () => {
      window.removeEventListener('switchTab', handleTabSwitch);
    };
  }, []);

  const handleProjectClick = (project: typeof projects[0]) => {
    if (project.hasDetailPage) {
      if (project.title === "Genre-Category Pair Advantages at Academy Awards") {
        navigate('/genre-category-project');
      } else if (project.title === "Student Business Program Development (SBC Workflow)") {
        navigate('/sbc-workflow');
      }
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleDashboardClick = (dashboard: typeof dashboards[0]) => {
    if (dashboard.hasDetailPage) {
      navigate('/skillset-network');
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">
          My Professional <span className="text-blue-600">Portfolio</span>
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-4xl mx-auto mb-8 h-auto gap-1 p-1">
            <TabsTrigger value="projects" className="text-xs sm:text-sm py-2 px-2">Projects</TabsTrigger>
            <TabsTrigger value="case-studies" className="text-xs sm:text-sm py-2 px-2">Case Studies</TabsTrigger>
            <TabsTrigger value="dashboards" className="text-xs sm:text-sm py-2 px-2">Dashboards</TabsTrigger>
            <TabsTrigger value="publications" className="text-xs sm:text-sm py-2 px-2">Publications</TabsTrigger>
            <TabsTrigger value="certifications" className="text-xs sm:text-sm py-2 px-2">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {projects.map((project, index) => (
                <Card key={index} className="relative hover:shadow-lg transition-shadow">
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
                          {project.tech.map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-green-600 mb-2">{project.impact}</p>
                        {project.hasDetailPage && (
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
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {caseStudies.map((study, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
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
          </TabsContent>

          <TabsContent value="dashboards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {dashboards.map((dashboard, index) => (
                <Card key={index} className="relative hover:shadow-lg transition-shadow">
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
                          {dashboard.tools.map((tool) => (
                            <span key={tool} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-green-600 mb-2">{dashboard.impact}</p>
                        {dashboard.hasDetailPage && (
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
          </TabsContent>

          <TabsContent value="publications" className="space-y-6">
            <div className="grid gap-6 max-w-4xl mx-auto">
              {publications.map((pub, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{pub.title}</CardTitle>
                    <CardDescription>{pub.journal} • {pub.year}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{pub.description}</p>
                    <Button
                      onClick={() => window.open(pub.link, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <span>Read Article</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {certifications.map((cert, index) => (
                <Card key={index} className="relative hover:shadow-lg transition-shadow">
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
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export { projects, caseStudies, dashboards, publications, certifications };
