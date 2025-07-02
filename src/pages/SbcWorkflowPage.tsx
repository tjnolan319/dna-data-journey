
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SbcWorkflowPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('projects');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Portfolio</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Student Business Program Development
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            BPMN Workflow Design for University-Backed Student Entrepreneurship
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["BPMN", "Stakeholder Interviews", "Process Design", "Higher Ed Policy Alignment"].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BPMN Diagram */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            SBC Workflow Process Model
          </h2>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <img 
              src="/lovable-uploads/86123c0e-3f79-435b-b8fe-13e85b3b7bf5.png" 
              alt="SBC Workflow BPMN Diagram" 
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Project Overview</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              The Student Business Center (SBC) Workflow project involved designing and refining a comprehensive process model 
              for launching university-backed student-owned business initiatives at Bentley University. This BPMN (Business Process 
              Model and Notation) diagram clarifies critical decision points and workflows between student entrepreneurs, 
              university administration, and external reviewers.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Through extensive stakeholder interviews and process analysis, I mapped out the complete journey from initial 
              student application through business launch and ongoing support. The model addresses key challenges including 
              application review processes, conditional approvals, resource allocation, and compliance with higher education 
              policy requirements.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              This workflow design is currently being implemented in a pilot program, providing a structured framework 
              for supporting student entrepreneurship while maintaining institutional oversight and risk management. 
              The process model serves as a blueprint for scaling the program across multiple academic departments and 
              ensuring consistent, fair evaluation of student business proposals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SbcWorkflowPage;
