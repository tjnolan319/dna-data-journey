
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const projects = [
  {
    title: "Sales Performance Dashboard",
    description: "Interactive dashboard analyzing quarterly sales trends and KPIs",
    tech: ["Tableau", "SQL", "Python"],
    impact: "25% improvement in sales forecasting accuracy"
  },
  {
    title: "Customer Segmentation Analysis",
    description: "Advanced clustering analysis to identify high-value customer segments",
    tech: ["R", "Machine Learning", "Power BI"],
    impact: "15% increase in customer retention"
  },
  {
    title: "Supply Chain Optimization",
    description: "Data-driven approach to optimize inventory and reduce costs",
    tech: ["Python", "AWS", "SQL"],
    impact: "$2M annual cost savings"
  }
];

const publications = [
  {
    title: "Modern Data Analytics in Business Strategy",
    journal: "Business Intelligence Quarterly",
    year: "2023",
    description: "A comprehensive study on integrating advanced analytics into strategic decision-making"
  },
  {
    title: "Predictive Modeling for Customer Behavior",
    journal: "Data Science Review",
    year: "2022",
    description: "Exploring machine learning techniques for customer lifetime value prediction"
  }
];

export const ProjectTabs = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">
          My Professional <span className="text-blue-600">Portfolio</span>
        </h2>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
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
                        <p className="text-sm font-medium text-green-600">{project.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="publications" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
        </Tabs>
      </div>
    </section>
  );
};
