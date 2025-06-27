
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
              <p className="text-slate-600">Professional journey in project management style</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <Calendar className="h-10 w-10 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Interactive Timeline</h4>
                <p className="text-slate-600 text-sm text-center">Explore my professional journey with an interactive Gantt chart visualization</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-10 w-10 text-purple-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Detailed Timeline</h4>
                <p className="text-slate-600 text-sm text-center">Click on any timeline item to view detailed achievements and skills developed</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-10 w-10 text-pink-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Career Progression</h4>
                <p className="text-slate-600 text-sm text-center">See how my education and work experiences build upon each other</p>
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
              <p className="text-slate-600">Educational journey through courses and semesters</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <GraduationCap className="h-10 w-10 text-green-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Course Timeline</h4>
                <p className="text-slate-600 text-sm text-center">Browse through my academic journey semester by semester</p>
              </div>
              <div className="flex flex-col items-center">
                <Calendar className="h-10 w-10 text-orange-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Detailed Courses</h4>
                <p className="text-slate-600 text-sm text-center">Click on any semester to view all courses taken during that period</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-10 w-10 text-purple-600 mb-3" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Academic Progression</h4>
                <p className="text-slate-600 text-sm text-center">See how my coursework built from undergraduate to graduate level</p>
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
