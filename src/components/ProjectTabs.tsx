<TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {projects.map((project, index) => (
                <Card key={index} className="relative hover:shadow-lg transition-shadow h-full flex flex-col">
                  {project.status && <StatusBanner status={project.status} />}
                  {/* Always reserve space for status banner */}
                  <CardHeader className="pt-16">
                    <CardTitle className="text-lg min-h-[3.5rem] flex items-start">{project.title}</CardTitle>
                    <CardDescription className="min-h-[4.5rem] flex items-start">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div>
                        <h4 className="font-medium text-sm text-slate-700 mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-2 min-h-[2rem]">
                          {project.tech.map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t mt-auto">
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
