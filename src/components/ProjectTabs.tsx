import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Users, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Exporting projects so other files can import it
export const projects = [
  {
    id: "genre-category",
    title: "Genre-Category Pair Advantages at Academy Awards",
    shortTitle: "Oscar Analytics",
    description:
      "Statistical analysis of Oscar nomination patterns and win probabilities across genre-category combinations using advanced data science techniques",
    tagline: "Entertainment Analytics",
    technologies: ["Python", "Statistical Analysis", "Data Visualization", "Predictive Modeling"],
    icon: TrendingUp,
    link: "/genre-category-project",
    details:
      "Comprehensive study analyzing 15+ years of Academy Awards data to identify strategic advantages for film positioning and award campaign optimization.",
  },
  {
    id: "skillset-network",
    title: "Interactive Skillset Network Diagram",
    shortTitle: "Skillset Network",
    description:
      "Dynamic visualization mapping skillsets based on GitHub project topics, with automated daily updates and interactive exploration features",
    tagline: "Data Visualization",
    technologies: ["Python", "D3.js", "GitHub API", "Data Visualization", "Automation"],
    icon: Network,
    link: "/skillset-network",
    details:
      "Automated system that scans GitHub repositories to create visual network diagrams showing skill relationships and expertise areas.",
  },
  {
    id: "sbc-workflow",
    title: "Student Business Program Development",
    shortTitle: "SBC Workflow",
    description:
      "Designed and refined the process model for launching a university-backed student-owned business initiative",
    tagline: "Process Design",
    technologies: ["BPMN", "Stakeholder Interviews", "Process Design", "Higher Ed Policy Alignment"],
    icon: Users,
    link: "/sbc-workflow",
    details:
      "Created BPMN diagram to clarify decision points and workflows between student businesses, the university, and external reviewers. Currently being implemented in pilot.",
  },
];

export const ProjectTabs = () => {
  const [activeProject, setActiveProject] = useState(0);
  const navigate = useNavigate();

  const handleViewDetails = (link: string) => {
    navigate(link);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Featured <span className="text-blue-600">Projects</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Showcasing data-driven solutions across entertainment analytics, visualization, and process optimization
          </p>
        </div>

        {/* Project Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {projects.map((project, index) => (
            <Button
              key={project.id}
              onClick={() => setActiveProject(index)}
              variant={activeProject === index ? "default" : "outline"}
              className="flex items-center space-x-2"
            >
              <project.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{project.shortTitle}</span>
              <span className="sm:hidden">{project.shortTitle.split(" ")[0]}</span>
            </Button>
          ))}
        </div>

        {/* Active Project Display */}
        <div className="max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {React.createElement(projects[activeProject].icon, { className: "h-6 w-6 text-blue-600" })}
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {projects[activeProject].tagline}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2">{projects[activeProject].title}</CardTitle>
                  <CardDescription className="text-base">{projects[activeProject].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-slate-700 leading-relaxed">{projects[activeProject].details}</p>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Technologies & Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    {projects[activeProject].technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleViewDetails(projects[activeProject].link)} className="flex items-center space-x-2">
                    <span>View Details</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
