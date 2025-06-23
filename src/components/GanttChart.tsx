
import { useMemo } from "react";

interface TimelineItem {
  id: string;
  title: string;
  category: "education" | "work";
  startDate: string;
  endDate: string;
  description: string;
  color: string;
}

export const GanttChart = () => {
  const timelineData: TimelineItem[] = [
    {
      id: "1",
      title: "Bachelor's in Business Administration",
      category: "education",
      startDate: "2018-09",
      endDate: "2022-05",
      description: "Focus on Analytics and Information Systems",
      color: "bg-blue-500"
    },
    {
      id: "2",
      title: "Data Science Certification",
      category: "education",
      startDate: "2021-06",
      endDate: "2021-12",
      description: "Python, SQL, Machine Learning",
      color: "bg-green-500"
    },
    {
      id: "3",
      title: "Junior Data Analyst",
      category: "work",
      startDate: "2022-06",
      endDate: "2023-08",
      description: "Financial Services Company",
      color: "bg-purple-500"
    },
    {
      id: "4",
      title: "Business Strategy Analyst",
      category: "work",
      startDate: "2023-09",
      endDate: "2024-12",
      description: "Current Role - Strategic Planning & Analytics",
      color: "bg-orange-500"
    }
  ];

  const startYear = 2018;
  const endYear = 2025;
  const totalYears = endYear - startYear;

  const getPositionAndWidth = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startOffset = (start.getFullYear() + start.getMonth() / 12 - startYear) / totalYears;
    const duration = (end.getFullYear() + end.getMonth() / 12 - start.getFullYear() - start.getMonth() / 12) / totalYears;
    
    return {
      left: `${startOffset * 100}%`,
      width: `${duration * 100}%`
    };
  };

  const yearMarkers = useMemo(() => {
    return Array.from({ length: totalYears + 1 }, (_, i) => startYear + i);
  }, []);

  return (
    <section id="gantt" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            My Professional Journey
          </h2>
          <p className="text-xl text-slate-600">
            Education and career progression over time
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8">
          {/* Year Headers */}
          <div className="relative mb-8">
            <div className="flex justify-between text-sm font-medium text-slate-600">
              {yearMarkers.map((year) => (
                <div key={year} className="flex-1 text-center">
                  {year}
                </div>
              ))}
            </div>
            <div className="h-px bg-slate-300 mt-2"></div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-6">
            {timelineData.map((item, index) => (
              <div key={item.id} className="relative">
                <div className="flex items-center mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${item.color} mr-3`}></span>
                  <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
                
                <div className="relative h-16 bg-slate-200 rounded-lg overflow-hidden">
                  <div
                    className={`absolute top-0 h-full ${item.color} rounded-lg flex items-center px-4 text-white font-medium shadow-lg hover:shadow-xl transition-shadow duration-300`}
                    style={getPositionAndWidth(item.startDate, item.endDate)}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{item.title}</div>
                      <div className="text-xs opacity-90 truncate">{item.description}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-slate-300">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-slate-600">Education</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              <span className="text-sm text-slate-600">Work Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
