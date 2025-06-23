
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
      color: "#3B82F6"
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
      color: "#10B981"
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
      color: "#8B5CF6"
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
      color: "#F59E0B"
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

  // Calculate positions for timeline segments
  const minYear = 2018;
  const maxYear = 2025;
  const totalYears = maxYear - minYear;
  const svgWidth = 800;
  const svgHeight = 400;

  const getXPosition = (year: number) => {
    return ((year - minYear) / totalYears) * (svgWidth - 100) + 50;
  };

  const getYPosition = (index: number) => {
    return svgHeight / 2 + (index % 2 === 0 ? -50 : 50);
  };

  return (
    <section id="dna-timeline" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Interactive DNA Strand Timeline
          </h2>
          <p className="text-xl text-slate-600">
            Click on any segment to explore my professional evolution
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <svg width={svgWidth} height={svgHeight} className="border rounded-lg bg-white shadow-lg">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Year markers */}
            {Array.from({ length: totalYears + 1 }, (_, i) => {
              const year = minYear + i;
              const x = getXPosition(year);
              return (
                <g key={year}>
                  <line x1={x} y1={svgHeight - 30} x2={x} y2={svgHeight - 10} stroke="#64748b" strokeWidth="2" />
                  <text x={x} y={svgHeight - 5} textAnchor="middle" className="fill-slate-600 text-sm font-medium">
                    {year}
                  </text>
                </g>
              );
            })}

            {/* DNA Double Helix */}
            <path
              d={`M 50 ${svgHeight/2} Q 200 ${svgHeight/2 - 60} 400 ${svgHeight/2} Q 600 ${svgHeight/2 + 60} 750 ${svgHeight/2}`}
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="4"
              opacity="0.6"
            />
            <path
              d={`M 50 ${svgHeight/2} Q 200 ${svgHeight/2 + 60} 400 ${svgHeight/2} Q 600 ${svgHeight/2 - 60} 750 ${svgHeight/2}`}
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="4"
              opacity="0.6"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            {/* Timeline segments */}
            {timelineData.map((item, index) => {
              const startX = getXPosition(item.startYear);
              const endX = getXPosition(item.endYear === 2024 ? 2025 : item.endYear);
              const y = getYPosition(index);
              const width = endX - startX;

              return (
                <g key={item.id}>
                  {/* Segment bar */}
                  <rect
                    x={startX}
                    y={y - 15}
                    width={width}
                    height={30}
                    fill={item.color}
                    rx="15"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleSegmentClick(item)}
                  />
                  
                  {/* Connecting line to main helix */}
                  <line
                    x1={startX + width/2}
                    y1={y}
                    x2={startX + width/2}
                    y2={svgHeight/2}
                    stroke={item.color}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.6"
                  />
                  
                  {/* Label */}
                  <text
                    x={startX + width/2}
                    y={y + (index % 2 === 0 ? -25 : 45)}
                    textAnchor="middle"
                    className="fill-slate-700 text-sm font-medium cursor-pointer hover:fill-slate-900"
                    onClick={() => handleSegmentClick(item)}
                  >
                    {item.title}
                  </text>
                  
                  {/* Company name */}
                  <text
                    x={startX + width/2}
                    y={y + (index % 2 === 0 ? -10 : 60)}
                    textAnchor="middle"
                    className="fill-slate-500 text-xs cursor-pointer"
                    onClick={() => handleSegmentClick(item)}
                  >
                    {item.company}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="text-center text-sm text-slate-500">
          Click on any segment above to explore the details of that period in my journey
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
