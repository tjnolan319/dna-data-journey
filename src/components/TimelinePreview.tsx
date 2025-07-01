
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, TrendingUp, GraduationCap } from "lucide-react";

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
            Explore my professional and academic journey
          </p>
        </div>

        {/* Combined Timeline Box */}
        <div className="bg-slate-50 rounded-2xl p-8 backdrop-blur-sm border border-slate-200 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Interactive Timeline Explorer</h3>
            <p className="text-slate-600">Visual journey through career milestones and academic achievements</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Career Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 text-center">Career Timeline</h4>
              <p className="text-slate-600 text-sm text-center">Interactive Gantt chart of roles, projects, and milestones</p>
            </div>

            {/* Academic Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-green-600 mb-2" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 text-center">Academic Timeline</h4>
              <p className="text-slate-600 text-sm text-center">Course progression from undergraduate to graduate programs</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-6 w-6 text-purple-600 mb-2" />
              <h5 className="font-medium text-slate-800">Detailed Insights</h5>
              <p className="text-slate-600 text-xs">Click periods for accomplishments and skills</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="h-6 w-6 text-pink-600 mb-2" />
              <h5 className="font-medium text-slate-800">Growth Tracking</h5>
              <p className="text-slate-600 text-xs">See how experiences connect and build momentum</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-6 w-6 text-orange-600 mb-2" />
              <h5 className="font-medium text-slate-800">Timeline Navigation</h5>
              <p className="text-slate-600 text-xs">Navigate through different periods and programs</p>
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
              className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              View Academic Timeline
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
