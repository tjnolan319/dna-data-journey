
import { useState } from "react";
import { X, Calendar, GraduationCap } from "lucide-react";

interface CourseTimelineItem {
  id: string;
  semester: string;
  year: number;
  courses: string[];
  school: "URI" | "Bentley" | "Transfer";
  color: string;
  schoolName: string;
}

interface DetailModalProps {
  item: CourseTimelineItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailModal = ({ item, isOpen, onClose }: DetailModalProps) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-200 shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{item.semester} {item.year}</h3>
              <div className="flex items-center space-x-2 text-blue-600 font-medium mb-4">
                <GraduationCap className="h-5 w-5" />
                <span>{item.schoolName}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 text-lg">Courses Taken ({item.courses.length}):</h4>
            <div className="grid gap-3">
              {item.courses.map((course, idx) => (
                <div key={idx} className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  {course}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DNATimeline = () => {
  const [selectedItem, setSelectedItem] = useState<CourseTimelineItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timelineData: CourseTimelineItem[] = [
    {
      id: "1",
      semester: "Fall",
      year: 2021,
      courses: [
        "BAI 210 - Managerial Statistics I",
        "MKT 265 - Marketing Principles",
        "PSY 399 - Multicultural Psychology"
      ],
      school: "URI",
      color: "#3b82f6",
      schoolName: "University of Rhode Island"
    },
    {
      id: "2",
      semester: "Winter",
      year: 2022,
      courses: [
        "MGT 345 - Business in Society"
      ],
      school: "URI",
      color: "#8b5cf6",
      schoolName: "University of Rhode Island"
    },
    {
      id: "3",
      semester: "Spring",
      year: 2022,
      courses: [
        "MGT 341 - Organizational Behavior",
        "MKT 366 - Consumer Behavior",
        "PSY 301 - Research Methods/Design in Behavioral Sciences"
      ],
      school: "URI",
      color: "#ec4899",
      schoolName: "University of Rhode Island"
    },
    {
      id: "4",
      semester: "Summer",
      year: 2022,
      courses: [
        "MKT 475 - Social Media Marketing"
      ],
      school: "URI",
      color: "#06b6d4",
      schoolName: "University of Rhode Island"
    },
    {
      id: "5",
      semester: "Fall",
      year: 2022,
      courses: [
        "CSV 302 - URI Community Service",
        "INE 315 - Legal Environment in Business",
        "MKT 367 - Marketing Research",
        "MKT 390 - Junior Career Passport Program",
        "MKT 467 - Customer Analytics",
        "MKT 468 - Global Marketing",
        "PSY 384 - Cognitive Psychology",
        "PSY 432 - Advanced Developmental Psychology"
      ],
      school: "URI",
      color: "#84cc16",
      schoolName: "University of Rhode Island"
    },
    {
      id: "6",
      semester: "Spring",
      year: 2023,
      courses: [
        "BAI 310 - Business Data Analysis with Excel",
        "MGT 445 - Strategic Management",
        "MKT 465 - Marketing Communications",
        "MKT 470 - Strategic Marketing Management",
        "PSY 381 - Physiological Psychology",
        "PSY 435 - Applied Psychological Research",
        "PSY 488 - Undergraduate Teaching Experience in Psychology"
      ],
      school: "URI",
      color: "#f97316",
      schoolName: "University of Rhode Island"
    },
    {
      id: "7",
      semester: "Fall",
      year: 2023,
      courses: [
        "CS 605 - Data Management and SQL for Analytics",
        "FI 623 - Investments",
        "GR 603 - Leading Responsibly",
        "IPM 652 - Managing with Analytics"
      ],
      school: "Bentley",
      color: "#3b82f6",
      schoolName: "Bentley University"
    },
    {
      id: "8",
      semester: "Spring",
      year: 2024,
      courses: [
        "GR 601 - Strategic Information Technology Alignment",
        "GR 602 - Business Process Management",
        "MA 610 - Optimization and Simulation for Business Decisions",
        "ST 625 - Quantitative Analysis for Business"
      ],
      school: "Bentley",
      color: "#10b981",
      schoolName: "Bentley University"
    },
    {
      id: "9",
      semester: "Summer",
      year: 2024,
      courses: [
        "GR 604 - Global Strategy",
        "GR 606 - Designing for the Value Chain"
      ],
      school: "Bentley",
      color: "#f59e0b",
      schoolName: "Bentley University"
    },
    {
      id: "10",
      semester: "Fall",
      year: 2024,
      courses: [
        "CS 602 - Data-Driven Development with Python",
        "GR 645 - Law, Ethics and Social Responsibility",
        "MA 611 - Time Series Analysis",
        "ST 635 - Intermediate Statistical Modeling for Business"
      ],
      school: "Bentley",
      color: "#8b5cf6",
      schoolName: "Bentley University"
    },
    {
      id: "11",
      semester: "Spring",
      year: 2025,
      courses: [
        "CS 650 - Data Analytics Architecture with Big Data",
        "MA 705 - Data Science",
        "MA 706 - Design of Experiments for Business",
        "MA 710 - Data Mining"
      ],
      school: "Bentley",
      color: "#ec4899",
      schoolName: "Bentley University"
    }
  ];

  const handleSegmentClick = (item: CourseTimelineItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Separate URI and Bentley data for timeline layout
  const uriData = timelineData.filter(item => item.school === "URI");
  const bentleyData = timelineData.filter(item => item.school === "Bentley");

  return (
    <section id="dna-timeline" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800">
            🧬 Academic Journey <span className="text-blue-600">Timeline</span>
          </h2>
          <p className="text-xl text-slate-600 mb-4">
            Hover over cards to preview courses, click to explore in detail
          </p>
          <p className="text-sm text-slate-500">
            * Only courses level 300 and above are displayed
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {timelineData.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group relative bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:border-blue-300"
                  onClick={() => handleSegmentClick(item)}
                >
                  {/* Colored top border */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  
                  {/* Main content - always visible */}
                  <div className="pt-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {item.semester} {item.year}
                    </h3>
                    <div className="flex items-center space-x-2 text-blue-600 font-medium mb-3">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm">{item.schoolName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.courses.length} courses</span>
                    </div>
                  </div>

                  {/* Expandable content on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Course Preview:</h4>
                      <div className="space-y-1">
                        {item.courses.slice(0, 3).map((course, idx) => (
                          <div key={idx} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                            {course}
                          </div>
                        ))}
                        {item.courses.length > 3 && (
                          <div className="text-xs text-blue-600 font-medium px-2 py-1">
                            +{item.courses.length - 3} more courses
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-2 italic">
                        Click to view all courses
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop/Tablet Timeline Layout */}
          <div className="hidden md:block">
            <div className="space-y-12">
              {/* URI Timeline */}
              <div>
                <div className="flex items-center mb-6">
                  <GraduationCap className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">University of Rhode Island</h3>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>
                  
                  <div className="space-y-8">
                    {uriData.map((item, index) => (
                      <div key={item.id} className={`flex items-start ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                          <div 
                            className="group relative bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-300 min-h-[140px]"
                            onClick={() => handleSegmentClick(item)}
                          >
                            <div 
                              className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            
                            <div className="pt-2">
                              <h4 className="text-lg font-bold text-slate-800 mb-1">
                                {item.semester} {item.year}
                              </h4>
                              <div className="flex items-center space-x-2 text-slate-500 mb-3">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm font-medium">{item.courses.length} courses</span>
                              </div>
                            </div>

                            <div className="absolute inset-x-4 top-20 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                              <div className="border-t border-slate-200 pt-3">
                                <h5 className="text-sm font-semibold text-slate-700 mb-2">Course Preview:</h5>
                                <div className="space-y-1">
                                  {item.courses.slice(0, 2).map((course, idx) => (
                                    <div key={idx} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                      {course}
                                    </div>
                                  ))}
                                  {item.courses.length > 2 && (
                                    <div className="text-xs text-blue-600 font-medium px-2 py-1">
                                      +{item.courses.length - 2} more courses
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 mt-2 italic">
                                  Click to view all courses
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Timeline dot */}
                        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10 mt-6"></div>
                        
                        <div className="w-5/12"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bentley Timeline */}
              <div>
                <div className="flex items-center mb-6">
                  <GraduationCap className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Bentley University</h3>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-purple-200 h-full"></div>
                  
                  <div className="space-y-8">
                    {bentleyData.map((item, index) => (
                      <div key={item.id} className={`flex items-start ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                          <div 
                            className="group relative bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-lg transition-shadow cursor-pointer hover:border-purple-300 min-h-[140px]"
                            onClick={() => handleSegmentClick(item)}
                          >
                            <div 
                              className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            
                            <div className="pt-2">
                              <h4 className="text-lg font-bold text-slate-800 mb-1">
                                {item.semester} {item.year}
                              </h4>
                              <div className="flex items-center space-x-2 text-slate-500 mb-3">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm font-medium">{item.courses.length} courses</span>
                              </div>
                            </div>

                            <div className="absolute inset-x-4 top-20 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                              <div className="border-t border-slate-200 pt-3">
                                <h5 className="text-sm font-semibold text-slate-700 mb-2">Course Preview:</h5>
                                <div className="space-y-1">
                                  {item.courses.slice(0, 2).map((course, idx) => (
                                    <div key={idx} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                      {course}
                                    </div>
                                  ))}
                                  {item.courses.length > 2 && (
                                    <div className="text-xs text-blue-600 font-medium px-2 py-1">
                                      +{item.courses.length - 2} more courses
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 mt-2 italic">
                                  Click to view all courses
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Timeline dot */}
                        <div className="w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10 mt-6"></div>
                        
                        <div className="w-5/12"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 mt-8">
          Click on any semester card to explore the complete course list
        </div>

        <DetailModal 
          item={selectedItem} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </div>
    </section>
  );
};
