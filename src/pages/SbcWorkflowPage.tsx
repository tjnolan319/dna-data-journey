import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, X } from "lucide-react";
import { useState } from "react";

import bpmnImage from "@/assets/BPMN_of_SBC.jpg";

const SbcWorkflowPage = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  const handleBackClick = () => {
    // Use a more reliable navigation method
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home page
      window.location.href = '/';
    }
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
    // Prevent body scroll when modal is open
    if (!isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            onClick={handleBackClick}
            variant="ghost"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Student Business <span className="text-blue-600">Program Development</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              BPMN workflow design for university-backed student entrepreneurship programs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>SBC Workflow Process Model</span>
                    <Button
                      onClick={handleZoomToggle}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <ZoomIn className="h-3 w-3" />
                      <span>Zoom</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    BPMN diagram clarifying decision points and workflows between students, university, and reviewers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg shadow-lg p-6 min-h-[400px] flex items-center justify-center">
                    <img
                      src={bpmnImage}
                      alt="BPMN Workflow Diagram of Student Business Program"
                      className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handleZoomToggle}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">BPMN Diagram Placeholder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Objective</h4>
                    <p className="text-sm text-slate-600">
                      Design comprehensive process model for launching university-backed student-owned business initiatives at Bentley University.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Key Challenge</h4>
                    <p className="text-sm text-slate-600">
                      With numerous complex processes involved, a key component is prioritizing modeling ones that have critical impact and room for improvement, as they can take considerable time to make and make correctly.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Implementation</h4>
                    <p className="text-sm text-slate-600">
                      Through extensive stakeholder interviews and process analysis, mapped complete journey from initial application through business launch and ongoing support.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-slate-700 mb-2">Tools & Methods:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['BPMN', 'Stakeholder Interviews', 'Process Design', 'Higher Ed Policy Alignment'].map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-green-600">
                        Currently being implemented in pilot program
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Demonstrated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div>• Process Modeling & Documentation</div>
                    <div>• Stakeholder Interview & Analysis</div>
                    <div>• Business Process Optimization</div>
                    <div>• Policy Alignment & Compliance</div>
                    <div>• Risk Management Framework</div>
                    <div>• Cross-functional Collaboration</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 overflow-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleZoomToggle();
            }
          }}
        >
          <Button
            onClick={handleZoomToggle}
            variant="outline"
            size="sm"
            className="fixed top-4 right-4 z-[60] bg-white hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="p-4">
            <img
              src={bpmnImage}
              alt="BPMN Workflow Diagram of Student Business Program - Zoomed"
              className="rounded-lg shadow-2xl w-full sm:w-auto sm:max-w-none mx-auto block"
              style={{ minWidth: '100%', minHeight: '100vh', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center h-96 bg-gray-200 rounded-lg mx-auto">
              <p className="text-gray-600">BPMN Diagram Placeholder (Zoomed)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SbcWorkflowPage;
