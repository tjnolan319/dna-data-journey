
import { useState } from "react";
import { X } from "lucide-react";

interface CourseTimelineItem {
  id: string;
  semester: string;
  year: number;
  courses: string[];
  school: "URI" | "Bentley" | "Transfer";
  color: string;
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
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-700">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{item.semester} {item.year}</h3>
              <p className="text-blue-400 font-medium mb-2">
                {item.school === "URI" ? "University of Rhode Island" : 
                 item.school === "Bentley" ? "Bentley University" : "Transfer Credits"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Courses Taken:</h4>
            <div className="grid gap-2">
              {item.courses.map((course, idx) => (
                <div key={idx} className="text-slate-300 bg-slate-700/50 p-2 rounded">
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
      year: 2020,
      courses: [
        "BUS 111 - Intro Bus Analy & Applications",
        "BUS 140G - The Power of Business",
        "ECN 201 - Prin of Econ: Microeconomics",
        "PLS 150 - Plants, People and the Planet",
        "PSY 113 - General Psychology",
        "URI 101 - Planning for Academic Success"
      ],
      school: "URI",
      color: "#3b82f6"
    },
    {
      id: "2",
      semester: "Spring",
      year: 2021,
      courses: [
        "ECN 202 - Prin of Econ: Macroeconomics",
        "EDC 312 - The Psychology of Learning",
        "ITL 100 - Accelerated Elementary Italian",
        "PSY 232 - Developmental Psychology",
        "PSY 235 - Theories of Personality",
        "PSY 488 - Undergrad Teaching Exp in PSY"
      ],
      school: "URI",
      color: "#10b981"
    },
    {
      id: "3",
      semester: "Fall",
      year: 2021,
      courses: [
        "ACC 201 - Financial Accounting",
        "BAI 210 - Managerial Stat. I",
        "MKT 265 - Marketing Principles",
        "PSY 200 - Quantitative Methods in PSY",
        "PSY 399 - Intro to Multicultural Psych",
        "WRT 227 - Business Communications"
      ],
      school: "URI",
      color: "#f59e0b"
    },
    {
      id: "4",
      semester: "Winter",
      year: 2022,
      courses: [
        "MGT 345 - Business in Society"
      ],
      school: "URI",
      color: "#8b5cf6"
    },
    {
      id: "5",
      semester: "Spring",
      year: 2022,
      courses: [
        "ACC 202 - Managerial Accounting",
        "FIN 220 - Financial Management",
        "MGT 341 - Organizational Behavior",
        "MKT 366 - Consumer Behavior",
        "PSY 301 - Res. Mthd/Design in Behav Sci.",
        "SCA 255 - Oper. & Supply Chain Mgt"
      ],
      school: "URI",
      color: "#ec4899"
    },
    {
      id: "6",
      semester: "Summer",
      year: 2022,
      courses: [
        "MKT 475 - Social Media - Marketing",
        "MUS 106 - History of Jazz"
      ],
      school: "URI",
      color: "#06b6d4"
    },
    {
      id: "7",
      semester: "Fall",
      year: 2022,
      courses: [
        "CSV 302 - URI Community Service",
        "INE 315 - Legal Environ - Business",
        "MKT 367 - Marketing Research",
        "MKT 390 - Junior Career Passport Program",
        "MKT 467 - Customer Analytics",
        "MKT 468 - Global Marketing",
        "PSY 384 - Cognitive Psychology",
        "PSY 432 - Advanced Developmental Psychol"
      ],
      school: "URI",
      color: "#84cc16"
    },
    {
      id: "8",
      semester: "Spring",
      year: 2023,
      courses: [
        "BAI 310 - Bus. Data Analysis with Excel",
        "MGT 445 - Strategic Management",
        "MKT 465 - Marketing Communications",
        "MKT 470 - Strategic Marketing Mgt.",
        "PSY 381 - Physiological Psychology",
        "PSY 435 - Applied Psychological Research",
        "PSY 488 - Undergrad Teaching Exp in PSY"
      ],
      school: "URI",
      color: "#f97316"
    },
    {
      id: "9",
      semester: "Fall",
      year: 2023,
      courses: [
        "CS 605 - Data Mgt & SQL for Analytics",
        "FI 623 - Investments",
        "GR 603D - Leading Responsibly",
        "IPM 652 - Managing with Analytics"
      ],
      school: "Bentley",
      color: "#3b82f6"
    },
    {
      id: "10",
      semester: "Spring",
      year: 2024,
      courses: [
        "GR 601 - Strategic Information Technology Alignment",
        "GR 602 - Business Process Management",
        "MA 610 - Optimization and Simulation for Business Decisions",
        "ST 625 - Quantitative Analysis for Busi"
      ],
      school: "Bentley",
      color: "#10b981"
    },
    {
      id: "11",
      semester: "Summer",
      year: 2024,
      courses: [
        "GR 604 - Global Strategy",
        "GR 606 - Designing For The Value Chain"
      ],
      school: "Bentley",
      color: "#f59e0b"
    },
    {
      id: "12",
      semester: "Fall",
      year: 2024,
      courses: [
        "CS 602 - Data-Driven Development with Python",
        "GR 645 - Law, Ethics and Social Responsibility",
        "MA 611 - Time Series Analysis",
        "ST 635 - Intermediate Statistical Model"
      ],
      school: "Bentley",
      color: "#8b5cf6"
    },
    {
      id: "13",
      semester: "Spring",
      year: 2025,
      courses: [
        "CS 650 - Data Analytics Architectures with Big Data",
        "MA 705 - Data Science",
        "MA 706 - Design of Experiments for Busi",
        "MA 710 - Data Mining"
      ],
      school: "Bentley",
      color: "#ec4899"
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

  const minYear = 2020;
  const maxYear = 2025;
  const totalYears = maxYear - minYear;
  const svgWidth = 1000;
  const svgHeight = 400;

  const getXPosition = (year: number) => {
    return ((year - minYear) / totalYears) * (svgWidth - 200) + 100;
  };

  const getYPosition = (item: CourseTimelineItem, index: number) => {
    const baseY = svgHeight / 2;
    const overlapOffset = 25;
    
    let yOffset = 0;
    const itemsToCheck = timelineData.slice(0, index);
    
    for (const otherItem of itemsToCheck) {
      if (item.year === otherItem.year) {
        yOffset += overlapOffset;
      }
    }
    
    const side = index % 2 === 0 ? -1 : 1;
    return baseY + (side * (40 + yOffset));
  };

  return (
    <section id="dna-timeline" className="py-20 bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🧬 Academic Journey Timeline
          </h2>
          <p className="text-xl text-slate-300">
            Click on any segment to explore my coursework through college
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px] w-full">
              <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                
                {Array.from({ length: totalYears + 1 }, (_, i) => {
                  const year = minYear + i;
                  const x = getXPosition(year);
                  return (
                    <g key={year}>
                      <line x1={x} y1={svgHeight - 40} x2={x} y2={svgHeight - 20} stroke="rgb(148, 163, 184)" strokeWidth="2" />
                      <text x={x} y={svgHeight - 5} textAnchor="middle" className="fill-slate-300 text-sm font-medium">
                        {year}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={`M 100 ${svgHeight/2} Q 250 ${svgHeight/2 - 60} 500 ${svgHeight/2} Q 750 ${svgHeight/2 + 60} 900 ${svgHeight/2}`}
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="4"
                />
                <path
                  d={`M 100 ${svgHeight/2} Q 250 ${svgHeight/2 + 60} 500 ${svgHeight/2} Q 750 ${svgHeight/2 - 60} 900 ${svgHeight/2}`}
                  fill="none"
                  stroke="url(#gradient2)"
                  strokeWidth="4"
                />

                {timelineData.map((item, index) => {
                  const x = getXPosition(item.year);
                  const y = getYPosition(item, index);
                  const width = 80;

                  return (
                    <g key={item.id}>
                      <rect
                        x={x - width/2}
                        y={y - 18}
                        width={width}
                        height={36}
                        fill={item.color}
                        rx="18"
                        className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:stroke-2 stroke-slate-300"
                        onClick={() => handleSegmentClick(item)}
                      />
                      
                      <line
                        x1={x}
                        y1={y}
                        x2={x}
                        y2={svgHeight/2}
                        stroke={item.color}
                        strokeWidth="2"
                        strokeDasharray="4,2"
                        opacity="0.7"
                      />
                      
                      <text
                        x={x}
                        y={y + (y < svgHeight/2 ? -30 : 50)}
                        textAnchor="middle"
                        className="fill-white text-sm font-semibold cursor-pointer hover:fill-blue-300"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.semester}
                      </text>
                      
                      <text
                        x={x}
                        y={y + (y < svgHeight/2 ? -15 : 65)}
                        textAnchor="middle"
                        className="fill-slate-300 text-xs cursor-pointer"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.year}
                      </text>
                      
                      <text
                        x={x}
                        y={y + 4}
                        textAnchor="middle"
                        className="fill-white text-xs font-medium cursor-pointer"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.courses.length} courses
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-slate-400 mt-6">
          Click on any segment above to explore the courses • Swipe or scroll horizontally to see the full timeline
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
