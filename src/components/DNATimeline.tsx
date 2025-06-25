
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

  return (
    <section id="dna-timeline" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800">
            🧬 Academic Journey <span className="text-blue-600">Timeline</span>
          </h2>
          <p className="text-xl text-slate-600 mb-4">
            Click on any semester to explore my coursework through college
          </p>
          <p className="text-sm text-slate-500">
            * Only courses level 300 and above are displayed
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="space-y-8">
              {timelineData.map((item, index) => (
                <div key={item.id} className="relative flex items-center group">
                  {/* Timeline dot */}
                  <div 
                    className="absolute left-6 w-4 h-4 rounded-full border-4 border-white shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-125 z-10"
                    style={{ backgroundColor: item.color }}
                    onClick={() => handleSegmentClick(item)}
                  ></div>
                  
                  {/* Content card */}
                  <div 
                    className="ml-16 flex-1 bg-white rounded-lg border border-slate-200 p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:border-blue-300"
                    onClick={() => handleSegmentClick(item)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {item.semester} {item.year}
                        </h3>
                        <div className="flex items-center space-x-2 text-blue-600 font-medium">
                          <GraduationCap className="h-4 w-4" />
                          <span className="text-sm">{item.schoolName}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.courses.length} courses</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.courses.slice(0, 4).map((course, idx) => (
                        <div key={idx} className="text-sm text-slate-600 bg-slate-50 px-3 py-1 rounded-md">
                          {course}
                        </div>
                      ))}
                      {item.courses.length > 4 && (
                        <div className="text-sm text-blue-600 font-medium px-3 py-1">
                          +{item.courses.length - 4} more courses
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 mt-8">
          Click on any semester above to explore the complete course list
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
