
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{item.title}</h3>
              <p className="text-blue-600 font-medium mb-2">{item.company}</p>
              <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">
                {item.startYear} - {item.endYear === 2024 ? 'Present' : item.endYear}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-slate-600 mb-6 leading-relaxed">{item.description}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Key Achievements:</h4>
              <ul className="space-y-2">
                {item.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-slate-600 flex items-start">
                    <span className="text-green-500 mr-2 mt-1">▪</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Skills Developed:</h4>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-full"
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
      color: "#48bb78"
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
      color: "#ed8936"
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
      color: "#9f7aea"
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
      color: "#667eea"
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
  const svgWidth = 1200;
  const svgHeight = 500;

  const getXPosition = (year: number) => {
    return ((year - minYear) / totalYears) * (svgWidth - 200) + 100;
  };

  const getYPosition = (item: DNATimelineItem, index: number) => {
    const baseY = svgHeight / 2;
    const overlapOffset = 40;
    
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
    return baseY + (side * (60 + yOffset));
  };

  return (
    <section id="dna-timeline" className="py-20" style={{
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      minHeight: "100vh",
      color: "white"
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{
            background: "linear-gradient(45deg, #ffeaa7, #fab1a0, #fd79a8)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            🧬 Interactive DNA Strand Timeline
          </h2>
          <p className="text-xl text-white/80">
            Click on any segment to explore my professional evolution
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "20px",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "20px"
        }}>
          <div className="w-full overflow-x-auto overflow-y-hidden" style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.3) transparent"
          }}>
            <div className="min-w-[1200px] w-full">
              <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                  
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#48bb78" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#ed8936" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#9f7aea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f093fb" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f093fb" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#ed8936" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#48bb78" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#667eea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#9f7aea" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {Array.from({ length: totalYears + 1 }, (_, i) => {
                  const year = minYear + i;
                  const x = getXPosition(year);
                  return (
                    <g key={year}>
                      <line x1={x} y1={svgHeight - 50} x2={x} y2={svgHeight - 20} stroke="rgba(255,234,167,0.7)" strokeWidth="2" />
                      <text x={x} y={svgHeight - 5} textAnchor="middle" className="fill-white text-sm font-medium">
                        {year}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={`M 100 ${svgHeight/2} Q 300 ${svgHeight/2 - 80} 600 ${svgHeight/2} Q 900 ${svgHeight/2 + 80} 1100 ${svgHeight/2}`}
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="6"
                />
                <path
                  d={`M 100 ${svgHeight/2} Q 300 ${svgHeight/2 + 80} 600 ${svgHeight/2} Q 900 ${svgHeight/2 - 80} 1100 ${svgHeight/2}`}
                  fill="none"
                  stroke="url(#gradient2)"
                  strokeWidth="6"
                />

                {timelineData.map((item, index) => {
                  const startX = getXPosition(item.startYear);
                  const endX = getXPosition(item.endYear === 2024 ? 2025 : item.endYear);
                  const y = getYPosition(item, index);
                  const width = Math.max(endX - startX, 80);

                  return (
                    <g key={item.id}>
                      <rect
                        x={startX}
                        y={y - 20}
                        width={width}
                        height={40}
                        fill={item.color}
                        rx="20"
                        className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:stroke-white hover:stroke-2"
                        onClick={() => handleSegmentClick(item)}
                      />
                      
                      <line
                        x1={startX + width/2}
                        y1={y}
                        x2={startX + width/2}
                        y2={svgHeight/2}
                        stroke={item.color}
                        strokeWidth="3"
                        strokeDasharray="8,4"
                        opacity="0.7"
                      />
                      
                      <text
                        x={startX + width/2}
                        y={y + (y < svgHeight/2 ? -35 : 55)}
                        textAnchor="middle"
                        className="fill-white text-sm font-semibold cursor-pointer hover:fill-yellow-200"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.title}
                      </text>
                      
                      <text
                        x={startX + width/2}
                        y={y + (y < svgHeight/2 ? -20 : 70)}
                        textAnchor="middle"
                        className="fill-white/70 text-xs cursor-pointer"
                        onClick={() => handleSegmentClick(item)}
                      >
                        {item.company}
                      </text>
                      
                      <text
                        x={startX + width/2}
                        y={y + 5}
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

        <div className="text-center text-sm text-white/70 mt-6">
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
