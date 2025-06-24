
import { useState } from "react";
import { X } from "lucide-react";

interface DNATimelineItem {
  id: string;
  startYear: number;
  endYear: number;
  title: string;
  company: string;
  description: string;
  achievements: string[];
  skills: string[];
  type: "education" | "work" | "certification";
  color: string;
}

interface DetailModalProps {
  item: DNATimelineItem | null;
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
              <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
              <p className="text-blue-400 font-medium mb-2">{item.company}</p>
              <span className="text-sm bg-slate-700 text-slate-200 px-3 py-1 rounded-full">
                {item.startYear} - {item.endYear === 2024 ? 'Present' : item.endYear}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-slate-300 mb-6 leading-relaxed">{item.description}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Key Achievements:</h4>
              <ul className="space-y-2">
                {item.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-slate-300 flex items-start">
                    <span className="text-blue-400 mr-2 mt-1 font-bold">▪</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Skills Developed:</h4>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 text-sm bg-slate-700 text-slate-200 rounded-full border border-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DNATimeline = () => {
  const [selectedItem, setSelectedItem] = useState<DNATimelineItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timelineData: DNATimelineItem[] = [
    {
      id: "1",
      startYear: 2024,
      endYear: 2024,
      title: "Business Strategy Analyst",
      company: "Tech Innovation Corp",
      description: "Leading strategic initiatives and data-driven decision making for enterprise solutions.",
      achievements: [
        "Developed predictive models that improved forecasting accuracy by 35%",
        "Led cross-functional team of 8 analysts on market expansion project",
        "Created executive dashboards tracking $50M+ revenue streams"
      ],
      skills: ["Strategic Planning", "Predictive Analytics", "Executive Reporting", "Team Leadership"],
      type: "work",
      color: "#10b981"
    },
    {
      id: "2",
      startYear: 2022,
      endYear: 2023,
      title: "Junior Data Analyst",
      company: "Financial Solutions Inc",
      description: "Analyzed customer behavior and market trends to support business growth initiatives.",
      achievements: [
        "Built automated reporting system reducing manual work by 60%",
        "Identified customer segments leading to 20% increase in retention",
        "Collaborated with product teams on feature optimization"
      ],
      skills: ["SQL", "Python", "Data Visualization", "Customer Analytics"],
      type: "work",
      color: "#f59e0b"
    },
    {
      id: "3",
      startYear: 2021,
      endYear: 2021,
      title: "Data Science Bootcamp",
      company: "DataLearn Academy",
      description: "Intensive 6-month program covering machine learning, statistics, and business applications.",
      achievements: [
        "Completed 15+ real-world projects",
        "Built recommendation system for e-commerce platform",
        "Graduated top 10% of cohort"
      ],
      skills: ["Machine Learning", "Statistical Analysis", "Python", "R"],
      type: "certification",
      color: "#8b5cf6"
    },
    {
      id: "4",
      startYear: 2018,
      endYear: 2022,
      title: "Bachelor of Business Administration",
      company: "State University",
      description: "Specialized in Analytics and Information Systems with a focus on business intelligence.",
      achievements: [
        "Graduated Magna Cum Laude (3.8 GPA)",
        "President of Business Analytics Club",
        "Won university-wide case competition"
      ],
      skills: ["Business Strategy", "Statistics", "Project Management", "Research Methods"],
      type: "education",
      color: "#3b82f6"
    }
  ];

  const handleSegmentClick = (item: DNATimelineItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const minYear = 2018;
  const maxYear = 2025;
  const totalYears = maxYear - minYear;
  const svgWidth = 1000;
  const svgHeight = 400;

  const getXPosition = (year: number) => {
    return ((year - minYear) / totalYears) * (svgWidth - 200) + 100;
  };

  const getYPosition = (item: DNATimelineItem, index: number) => {
    const baseY = svgHeight / 2;
    const overlapOffset = 35;
    
    let yOffset = 0;
    const itemsToCheck = timelineData.slice(0, index);
    
    for (const otherItem of itemsToCheck) {
      const itemStart = item.startYear;
      const itemEnd = item.endYear === 2024 ? 2025 : item.endYear;
      const otherStart = otherItem.startYear;
      const otherEnd = otherItem.endYear === 2024 ? 2025 : otherItem.endYear;
      
      if (itemStart < otherEnd && itemEnd > otherStart) {
        yOffset += overlapOffset;
      }
    }
    
    const side = index % 2 === 0 ? -1 : 1;
    return baseY + (side * (50 + yOffset));
  };

  return (
    <section id="dna-timeline" className="py-20 bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🧬 Interactive DNA Strand Timeline
          </h2>
          <p className="text-xl text-slate-300">
            Click on any segment to explore my professional evolution
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
          <div className="w-full overflow-x-auto" style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "rgb(71, 85, 105) transparent"
          }}>
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
                  const startX = getXPosition(item.startYear);
                  const endX = getXPosition(item.endYear === 2024 ? 2025 : item.endYear);
                  const y = getYPosition(item, index);
                  const width = Math.max(endX - startX, 70);

                  return (
                    <g key={item.id}>
                      <rect
                        x={startX}
                        y={y - 18}
                        width={width}
                        height={36}
                        fill={item.color}
                        rx="18"
                        className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:stroke-2 stroke-slate-300"
                        onClick={() => handleSegmentClick(item)}
                      />
                      
                      <line
                        x1={startX + width/2}
                        y1={y}
                        x2={startX + width/2}
                        y2={svgHeight/2}
                        stroke={item.color}
                        strokeWidth="2"
                        strokeDasharray="4,2"
                        opacity="0.7"
                      />
                      
                      <text
                        x={startX + width/2}
                        y={y + (y < svgHeight/2 ? -30 : 50)}
                        textAnchor="middle"
                        className="fill-white text-sm font-semibold cursor-pointer hover:fill-blue-300"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.title}
                      </text>
                      
                      <text
                        x={startX + width/2}
                        y={y + (y < svgHeight/2 ? -15 : 65)}
                        textAnchor="middle"
                        className="fill-slate-300 text-xs cursor-pointer"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.company}
                      </text>
                      
                      <text
                        x={startX + width/2}
                        y={y + 4}
                        textAnchor="middle"
                        className="fill-white text-xs font-medium cursor-pointer"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.startYear}-{item.endYear === 2024 ? 'Present' : item.endYear}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-slate-400 mt-6">
          Click on any segment above to explore the details • Swipe or scroll horizontally to see the full timeline
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
