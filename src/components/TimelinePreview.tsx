
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, TrendingUp } from "lucide-react";

export const TimelinePreview = () => {
  const navigate = useNavigate();

  return (
    <section id="gantt" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-800">
            🧬 Career Timeline - Project View
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Professional journey mapped in project management style
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 backdrop-blur-sm border border-slate-200 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Interactive Timeline</h3>
              <p className="text-slate-600 text-sm">Explore my professional journey with an interactive Gantt chart visualization</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Detailed Timeline</h3>
              <p className="text-slate-600 text-sm">Click on any timeline item to view detailed achievements and skills developed</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-pink-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Career Progression</h3>
              <p className="text-slate-600 text-sm">See how my education and work experiences build upon each other</p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/timeline')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            View Interactive Timeline
          </Button>
        </div>
      </div>
    </section>
  );
};
