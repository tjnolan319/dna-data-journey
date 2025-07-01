
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Career Timeline */}
          <div className="bg-slate-50 rounded-2xl p-8 backdrop-blur-sm border border-slate-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Career Timeline</h3>
              <p className="text-slate-600">Professional journey & achievements</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <Calendar className="h-10 w-10 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Interactive Gantt Chart</h4>
                <p className="text-slate-600 text-sm text-center">Visual timeline of roles, projects, and milestones</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-10 w-10 text-purple-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Detailed Insights</h4>
                <p className="text-slate-600 text-sm text-center">Click any period to see accomplishments and skills gained</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-10 w-10 text-pink-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Growth Tracking</h4>
                <p className="text-slate-600 text-sm text-center">See how experiences connect and build momentum</p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/timeline')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              View Career Timeline
            </Button>
          </div>

          {/* Academic Timeline */}
          <div className="bg-slate-50 rounded-2xl p-8 backdrop-blur-sm border border-slate-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Academic Timeline</h3>
              <p className="text-slate-600">Educational foundation & coursework</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <GraduationCap className="h-10 w-10 text-green-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Semester Overview</h4>
                <p className="text-slate-600 text-sm text-center">Navigate through undergraduate and graduate programs</p>
              </div>
              <div className="flex flex-col items-center">
                <Calendar className="h-10 w-10 text-orange-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Course Details</h4>
                <p className="text-slate-600 text-sm text-center">Explore specific courses and learning outcomes</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-10 w-10 text-purple-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Skill Development</h4>
                <p className="text-slate-600 text-sm text-center">Track knowledge progression from basics to advanced topics</p>
              </div>
            </div>

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
