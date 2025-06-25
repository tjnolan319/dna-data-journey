
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const projects = [
  {
    title: "Interactive Skillset Network Diagram",
    description: "Network visualization mapping skillsets based on GitHub project topics, with automated daily updates",
    tech: ["Python", "Data Visualization", "GitHub API"],
    impact: "Visual representation for non-technical users"
  },
  {
    title: "Genre-Category Pair Advantages at Academy Awards",
    description: "Data science analysis of Academy Award patterns using statistical methods",
    tech: ["Python", "Statistical Analysis", "Deepnote"],
    impact: "Published research findings",
    hasDetailPage: true
  },
  {
    title: "Telehealth Platform Growth Strategy",
    description: "Strategic scaling of clinical staff and digital marketing initiatives for healthcare startup",
    tech: ["Market Research", "SEO", "Digital Marketing"],
    impact: "Scaled from 0 to 10 clinical staff in 18 months"
  }
];

const publications = [
  {
    title: "Are my peers impulsive? Normative perceptions of impulsivity and associations with personal impulsivity and alcohol use outcomes",
    journal: "Journal of Substance Use",
    year: "2024",
    description: "Research examining whether individuals perceived their peers' impulsivity as different from their own impulsivity and if perceptions of peers' impulsivity moderated the associations between personal impulsivity and alcohol use and consequences."
  }
];

const certifications = [
  {
    title: "Alteryx Designer Cloud Core",
    issuer: "Alteryx",
    year: "2025",
    expires: "2027"
  },
  {
    title: "Alteryx Foundational Micro-Credential", 
    issuer: "Alteryx",
    year: "2025",
    expires: "2027"
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

export const ProjectTabs = () => {
  const navigate = useNavigate();

  const handleProjectClick = (project: typeof projects[0]) => {
    if (project.hasDetailPage) {
      navigate('/genre-category-project');
    }
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">
          My Professional <span className="text-blue-600">Portfolio</span>
        </h2>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
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

          <TabsContent value="publications" className="space-y-6">
            <div className="grid gap-6">
              {publications.map((pub, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{pub.title}</CardTitle>
                    <CardDescription>{pub.journal} • {pub.year}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{pub.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
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
