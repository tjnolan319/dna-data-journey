
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, GraduationCap } from "lucide-react";

export const TimelinePreview = () => {
  const navigate = useNavigate();

  return (
    <section id="gantt" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-800">
            🧬 Timeline Views
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Interactive journey through career and academic milestones
          </p>
        </div>

        {/* Streamlined Timeline Box */}
        <div className="bg-slate-50 rounded-2xl p-8 backdrop-blur-sm border border-slate-200 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Interactive Timeline Explorer</h3>
            <p className="text-slate-600">Visual journey through professional and academic achievements</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Career Timeline */}
            <div className="text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Career Timeline</h4>
              <p className="text-slate-600 text-sm">Interactive Gantt chart of roles and projects</p>
            </div>

            {/* Academic Timeline */}
            <div className="text-center">
              <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Academic Timeline</h4>
              <p className="text-slate-600 text-sm">Course progression and degree programs</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/timeline')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              View Career Timeline
            </Button>
            <Button
              onClick={() => navigate('/academic-timeline')}
              className="w-full bg-green-600 hover:green-blue-700 text-white px-8 py-3 text-lg"
            >
              View Academic Timeline
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
