
import { useState } from "react";
import { X, Calendar, GraduationCap, BookOpen } from "lucide-react";

interface Course {
  code: string;
  name: string;
  credits?: number;
}

interface SemesterData {
  id: string;
  semester: string;
  year: number;
  school: "URI" | "Bentley";
  schoolName: string;
  color: string;
  courses: Course[];
}

interface DetailModalProps {
  semester: SemesterData | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailModal = ({ semester, isOpen, onClose }: DetailModalProps) => {
  if (!isOpen || !semester) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-slate-200 shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{semester.semester} {semester.year}</h3>
              <div className="flex items-center space-x-2 text-blue-600 font-medium mb-4">
                <GraduationCap className="h-5 w-5" />
                <span>{semester.schoolName}</span>
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
            <h4 className="font-semibold text-slate-800 mb-4 text-lg">All Courses ({semester.courses.length}):</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {semester.courses.map((course, idx) => (
                <div key={idx} className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="font-medium text-slate-800 mb-1">{course.code}</div>
                  <div className="text-sm text-slate-600">{course.name}</div>
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
  const [selectedSemester, setSelectedSemester] = useState<SemesterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const semesterData: SemesterData[] = [
    {
      id: "1",
      semester: "Fall",
      year: 2021,
      school: "URI",
      schoolName: "University of Rhode Island",
      color: "#3b82f6",
      courses: [
        { code: "BAI 210", name: "Managerial Statistics I" },
        { code: "MKT 265", name: "Marketing Principles" },
        { code: "PSY 399", name: "Multicultural Psychology" }
      ]
    },
    {
      id: "2",
      semester: "Winter",
      year: 2022,
      school: "URI",
      schoolName: "University of Rhode Island",
      color: "#8b5cf6",
      courses: [
        { code: "MGT 345", name: "Business in Society" }
      ]
    },
    {
      id: "3",
      semester: "Spring",
      year: 2022,
      school: "URI",
      schoolName: "University of Rhode Island",
      color: "#ec4899",
      courses: [
        { code: "MGT 341", name: "Organizational Behavior" },
        { code: "MKT 366", name: "Consumer Behavior" },
        { code: "PSY 301", name: "Research Methods/Design in Behavioral Sciences" }
      ]
    },
    {
      id: "4",
      semester: "Summer",
      year: 2022,
      school: "URI",
      schoolName: "University of Rhode Island",
      color: "#06b6d4",
      courses: [
        { code: "MKT 475", name: "Social Media Marketing" }
      ]
    },
    {
      id: "5",
      semester: "Fall",
      year: 2022,
      school: "URI",
      schoolName: "University of Rhode Island",
      color: "#84cc16",
      courses: [
        { code: "CSV 302", name: "URI Community Service" },
        { code: "INE 315", name: "Legal Environment in Business" },
        { code: "MKT 367", name: "Marketing Research" },
        { code: "MKT 390", name: "Junior Career Passport Program" },
        { code: "MKT 467", name: "Customer Analytics" },
        { code: "MKT 468", name: "Global Marketing" },
        { code: "PSY 384", name: "Cognitive Psychology" },
        { code: "PSY 432", name: "Advanced Developmental Psychology" }
      ]
    },
    {
      id: "6",
      semester: "Spring",
      year: 2023,
      school: "URI",
      schoolName: "University of Rhode Island",
      color: "#f97316",
      courses: [
        { code: "BAI 310", name: "Business Data Analysis with Excel" },
        { code: "MGT 445", name: "Strategic Management" },
        { code: "MKT 465", name: "Marketing Communications" },
        { code: "MKT 470", name: "Strategic Marketing Management" },
        { code: "PSY 381", name: "Physiological Psychology" },
        { code: "PSY 435", name: "Applied Psychological Research" },
        { code: "PSY 488", name: "Undergraduate Teaching Experience in Psychology" }
      ]
    },
    {
      id: "7",
      semester: "Fall",
      year: 2023,
      school: "Bentley",
      schoolName: "Bentley University",
      color: "#3b82f6",
      courses: [
        { code: "CS 605", name: "Data Management and SQL for Analytics" },
        { code: "FI 623", name: "Investments" },
        { code: "GR 603", name: "Leading Responsibly" },
        { code: "IPM 652", name: "Managing with Analytics" }
      ]
    },
    {
      id: "8",
      semester: "Spring",
      year: 2024,
      school: "Bentley",
      schoolName: "Bentley University",
      color: "#10b981",
      courses: [
        { code: "GR 601", name: "Strategic Information Technology Alignment" },
        { code: "GR 602", name: "Business Process Management" },
        { code: "MA 610", name: "Optimization and Simulation for Business Decisions" },
        { code: "ST 625", name: "Quantitative Analysis for Business" }
      ]
    },
    {
      id: "9",
      semester: "Summer",
      year: 2024,
      school: "Bentley",
      schoolName: "Bentley University",
      color: "#f59e0b",
      courses: [
        { code: "GR 604", name: "Global Strategy" },
        { code: "GR 606", name: "Designing for the Value Chain" }
      ]
    },
    {
      id: "10",
      semester: "Fall",
      year: 2024,
      school: "Bentley",
      schoolName: "Bentley University",
      color: "#8b5cf6",
      courses: [
        { code: "CS 602", name: "Data-Driven Development with Python" },
        { code: "GR 645", name: "Law, Ethics and Social Responsibility" },
        { code: "MA 611", name: "Time Series Analysis" },
        { code: "ST 635", name: "Intermediate Statistical Modeling for Business" }
      ]
    },
    {
      id: "11",
      semester: "Spring",
      year: 2025,
      school: "Bentley",
      schoolName: "Bentley University",
      color: "#ec4899",
      courses: [
        { code: "CS 650", name: "Data Analytics Architecture with Big Data" },
        { code: "MA 705", name: "Data Science" },
        { code: "MA 706", name: "Design of Experiments for Business" },
        { code: "MA 710", name: "Data Mining" }
      ]
    }
  ];

  const handleSemesterClick = (semester: SemesterData) => {
    setSelectedSemester(semester);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSemester(null);
  };

  // Group by school
  const uriSemesters = semesterData.filter(s => s.school === "URI");
  const bentleySemesters = semesterData.filter(s => s.school === "Bentley");

  return (
    <section id="dna-timeline" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800">
            🧬 Academic Journey <span className="text-blue-600">Timeline</span>
          </h2>
          <p className="text-xl text-slate-600 mb-4">
            Click any semester card to explore detailed course information
          </p>
          <p className="text-sm text-slate-500">
            * Only courses level 300 and above are displayed
          </p>
        </div>

        <div className="space-y-16">
          {/* URI Section */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3 bg-white rounded-lg px-6 py-3 shadow-md border border-slate-200">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-800">University of Rhode Island</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uriSemesters.map((semester) => (
                <div 
                  key={semester.id}
                  onClick={() => handleSemesterClick(semester)}
                  className="group bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <div 
                    className="h-2 w-full rounded-t-lg mb-4"
                    style={{ backgroundColor: semester.color }}
                  ></div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-slate-800 mb-1">
                      {semester.semester} {semester.year}
                    </h4>
                    <div className="flex items-center space-x-2 text-slate-500">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">{semester.courses.length} courses</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-slate-700 text-sm">Featured Courses:</h5>
                    {semester.courses.slice(0, 3).map((course, idx) => (
                      <div key={idx} className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-md">
                        <div className="font-medium">{course.code}</div>
                        <div className="truncate">{course.name}</div>
                      </div>
                    ))}
                    {semester.courses.length > 3 && (
                      <div className="text-xs text-blue-600 font-medium px-3 py-2">
                        +{semester.courses.length - 3} more courses
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-slate-500 italic text-center">
                    Click to view all courses
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bentley Section */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3 bg-white rounded-lg px-6 py-3 shadow-md border border-slate-200">
                <GraduationCap className="h-6 w-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-800">Bentley University</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bentleySemesters.map((semester) => (
                <div 
                  key={semester.id}
                  onClick={() => handleSemesterClick(semester)}
                  className="group bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <div 
                    className="h-2 w-full rounded-t-lg mb-4"
                    style={{ backgroundColor: semester.color }}
                  ></div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-slate-800 mb-1">
                      {semester.semester} {semester.year}
                    </h4>
                    <div className="flex items-center space-x-2 text-slate-500">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">{semester.courses.length} courses</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-slate-700 text-sm">Featured Courses:</h5>
                    {semester.courses.slice(0, 3).map((course, idx) => (
                      <div key={idx} className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-md">
                        <div className="font-medium">{course.code}</div>
                        <div className="truncate">{course.name}</div>
                      </div>
                    ))}
                    {semester.courses.length > 3 && (
                      <div className="text-xs text-blue-600 font-medium px-3 py-2">
                        +{semester.courses.length - 3} more courses
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-slate-500 italic text-center">
                    Click to view all courses
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DetailModal 
          semester={selectedSemester} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </div>
    </section>
  );
};
