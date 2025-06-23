
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface DNATimelineItem {
  id: string;
  date: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
  skills: string[];
  type: "education" | "work" | "certification";
}

export const DNATimeline = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const timelineData: DNATimelineItem[] = [
    {
      id: "1",
      date: "2024 - Present",
      title: "Business Strategy Analyst",
      company: "Tech Innovation Corp",
      description: "Leading strategic initiatives and data-driven decision making for enterprise solutions.",
      achievements: [
        "Developed predictive models that improved forecasting accuracy by 35%",
        "Led cross-functional team of 8 analysts on market expansion project",
        "Created executive dashboards tracking $50M+ revenue streams"
      ],
      skills: ["Strategic Planning", "Predictive Analytics", "Executive Reporting", "Team Leadership"],
      type: "work"
    },
    {
      id: "2",
      date: "2022 - 2023",
      title: "Junior Data Analyst",
      company: "Financial Solutions Inc",
      description: "Analyzed customer behavior and market trends to support business growth initiatives.",
      achievements: [
        "Built automated reporting system reducing manual work by 60%",
        "Identified customer segments leading to 20% increase in retention",
        "Collaborated with product teams on feature optimization"
      ],
      skills: ["SQL", "Python", "Data Visualization", "Customer Analytics"],
      type: "work"
    },
    {
      id: "3",
      date: "2021",
      title: "Data Science Bootcamp",
      company: "DataLearn Academy",
      description: "Intensive 6-month program covering machine learning, statistics, and business applications.",
      achievements: [
        "Completed 15+ real-world projects",
        "Built recommendation system for e-commerce platform",
        "Graduated top 10% of cohort"
      ],
      skills: ["Machine Learning", "Statistical Analysis", "Python", "R"],
      type: "certification"
    },
    {
      id: "4",
      date: "2018 - 2022",
      title: "Bachelor of Business Administration",
      company: "State University",
      description: "Specialized in Analytics and Information Systems with a focus on business intelligence.",
      achievements: [
        "Graduated Magna Cum Laude (3.8 GPA)",
        "President of Business Analytics Club",
        "Won university-wide case competition"
      ],
      skills: ["Business Strategy", "Statistics", "Project Management", "Research Methods"],
      type: "education"
    }
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "work": return "border-blue-500 bg-blue-50";
      case "education": return "border-green-500 bg-green-50";
      case "certification": return "border-purple-500 bg-purple-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "work": return "💼";
      case "education": return "🎓";
      case "certification": return "📜";
      default: return "📋";
    }
  };

  return (
    <section id="dna-timeline" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            DNA Strand Timeline
          </h2>
          <p className="text-xl text-slate-600">
            The building blocks of my professional evolution
          </p>
        </div>

        <div className="relative">
          {/* DNA Strand Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <div key={item.id} className="relative">
                {/* DNA Node */}
                <div className="absolute left-6 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-lg"></div>
                
                {/* Content Card */}
                <div className={`ml-16 border-l-4 ${getTypeColor(item.type)} rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(item.type)}</span>
                        <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full">
                          {item.date}
                        </span>
                      </div>
                      {expandedItems.has(item.id) ? 
                        <ChevronDown className="h-5 w-5 text-slate-400" /> : 
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      }
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-blue-600 font-medium mb-3">{item.company}</p>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  {expandedItems.has(item.id) && (
                    <div className="px-6 pb-6 space-y-4 animate-fade-in">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Key Achievements:</h4>
                        <ul className="space-y-1">
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
                              className="px-3 py-1 text-sm bg-white text-slate-700 rounded-full border border-slate-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
