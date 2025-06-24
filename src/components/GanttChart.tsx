
import React, { useState, useEffect, useRef } from "react"

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const getYearMonth = (year: number, month: number) => {
    return year + (month - 1) / 12
}

const timelineData = [
    {
        id: 1,
        title: "Bachelor's Degrees",
        type: "education",
        icon: "🎓",
        startYear: getYearMonth(2020, 9),
        endYear: getYearMonth(2023, 5),
        year: "Sept 2020 - May 2023",
        location: "University of Rhode Island",
        highlights: [
            "Dual degree: Business Admin & Psychology",
            "GPA: 3.87 Summa Cum Laude",
            "Marketing Award recipient",
        ],
        skills: ["Marketing", "Psychology", "Research", "Analytics"],
        color: "#667eea",
        connections: [2],
    },
    {
        id: 2,
        title: "Teacher's Assistant",
        type: "work",
        icon: "👨‍🏫",
        startYear: getYearMonth(2021, 6),
        endYear: getYearMonth(2023, 5),
        year: "June 2021 - May 2023",
        location: "University of Rhode Island",
        highlights: [
            "Instructed business development courses",
            "Collaborated on student evaluations",
            "Mentored 50+ students",
        ],
        skills: ["Teaching", "Communication", "Leadership", "Mentoring"],
        color: "#48bb78",
        connections: [1, 3, 4],
    },
    {
        id: 3,
        title: "Tour Guide & Trainer",
        type: "work",
        icon: "🎯",
        startYear: getYearMonth(2022, 1),
        endYear: getYearMonth(2023, 5),
        year: "Jan 2022 - May 2023",
        location: "University of Rhode Island",
        highlights: [
            "Led campus tours for groups of 1-30+ visitors daily",
            "Presented to 100+ prospective students in info sessions",
            "Coordinated large-scale recruitment events & booths",
            "Trained 3 new tour guides with 22-page manual over 6-8 weeks",
            "Served on recruitment board for strategic planning",
        ],
        skills: [
            "Public Speaking",
            "Training & Development",
            "Event Coordination",
            "Customer Service",
            "Leadership",
        ],
        color: "#f093fb",
        connections: [2, 4],
    },
    {
        id: 4,
        title: "HR Manager",
        type: "work",
        icon: "👥",
        startYear: getYearMonth(2021, 6),
        endYear: getYearMonth(2023, 10),
        year: "June 2021 - Oct 2023",
        location: "Lighthouse Health (Remote)",
        highlights: [
            "Directed telehealth startup from inception",
            "Recruited 6+ provider types",
            "7% digital marketing engagement rate",
        ],
        skills: [
            "Recruitment",
            "Digital Marketing",
            "Startup Operations",
            "Remote Management",
        ],
        color: "#ed8936",
        connections: [2, 3, 5],
    },
    {
        id: 5,
        title: "Practice Manager",
        type: "work",
        icon: "📊",
        startYear: getYearMonth(2023, 10),
        endYear: getYearMonth(2024, 3),
        year: "Oct 2023 - Mar 2024",
        location: "Lighthouse Health (Remote)",
        highlights: [
            "Scaled clinical staff 0→10 in 18 months",
            "Built university partnerships",
            "Led patient acquisition strategies",
        ],
        skills: [
            "Team Building",
            "Partnerships",
            "Strategy",
            "Healthcare Operations",
        ],
        color: "#9f7aea",
        connections: [4, 6],
    },
    {
        id: 6,
        title: "Master's Degrees",
        type: "education",
        icon: "🎓",
        startYear: getYearMonth(2023, 9),
        endYear: getYearMonth(2025, 5),
        year: "Sept 2023 - May 2025",
        location: "Bentley University",
        highlights: [
            "MBA in Information Systems",
            "MS in Business Analytics",
            "GPA: 3.89 High Distinction",
        ],
        skills: [
            "Data Analytics",
            "Information Systems",
            "Business Strategy",
            "Technology",
        ],
        color: "#667eea",
        connections: [5, 7],
    },
    {
        id: 7,
        title: "Program Assistant",
        type: "work",
        icon: "🚀",
        startYear: getYearMonth(2024, 8),
        endYear: getYearMonth(2025, 5),
        year: "Aug 2024 - May 2025",
        location: "Bentley Entrepreneurship Hub",
        highlights: [
            "Developed student business programs",
            "Managed digital marketing & web presence",
            "Analyzed program performance metrics",
        ],
        skills: [
            "Program Development",
            "Web Management",
            "Performance Analytics",
            "Entrepreneurship",
        ],
        color: "#38b2ac",
        connections: [6],
    },
]

const getMonthsInRange = (startYear: number, endYear: number) => {
    const monthsList = []
    for (let year = Math.floor(startYear); year <= Math.ceil(endYear); year++) {
        for (let month = 0; month < 12; month++) {
            const currentTime = year + month / 12
            if (currentTime >= startYear && currentTime <= endYear) {
                monthsList.push({
                    label: `${months[month]} ${year}`,
                    value: currentTime,
                    isYearStart: month === 0,
                })
            }
        }
    }
    return monthsList
}

const timelineMonths = getMonthsInRange(2020.6, getYearMonth(2025, 8))
const baseMonthWidth = 50
const rowHeight = 70
const chartStartX = 250
const chartStartY = 120

export const GanttChart = () => {
    const [expandedTask, setExpandedTask] = useState<number | null>(null)
    const [hoveredTask, setHoveredTask] = useState<number | null>(null)
    const [filterType, setFilterType] = useState("all")
    const [currentTime] = useState(getYearMonth(2025, 6))
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [zoomLevel, setZoomLevel] = useState(1)
    const monthWidth = baseMonthWidth * zoomLevel
    const chartWidth = timelineMonths.length * monthWidth
    const chartHeight = timelineData.length * rowHeight + 150

    const filteredData = timelineData.filter(
        (item) => filterType === "all" || item.type === filterType
    )

    const getTaskPosition = (startYear: number, endYear: number) => {
        const startIndex = timelineMonths.findIndex((m) => m.value > startYear) - 1
        const endIndex = timelineMonths.findIndex((m) => m.value > endYear) - 1
        const adjustedStartIndex = startIndex < 0 ? 0 : startIndex
        const adjustedEndIndex = endIndex < 0 ? timelineMonths.length - 1 : endIndex
        const x = adjustedStartIndex * monthWidth
        const width = (adjustedEndIndex - adjustedStartIndex + 1) * monthWidth
        return { x, width: Math.max(width, monthWidth) }
    }

    const getCurrentTimePosition = () => {
        const currentIndex = timelineMonths.findIndex((m) => m.value >= currentTime)
        return currentIndex >= 0 ? currentIndex * monthWidth : timelineMonths.length * monthWidth
    }

    return (
        <section id="gantt" className="py-20 bg-slate-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        🧬 Career Timeline - Project View
                    </h2>
                    <p className="text-xl text-slate-300 mb-8">
                        Professional journey mapped in project management style
                    </p>

                    {/* Controls */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {["all", "education", "work"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setFilterType(filter)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    filterType === filter
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                            >
                                {filter === "all" ? "🌟 All" : filter === "education" ? "🎓 Education" : "💼 Work"}
                            </button>
                        ))}

                        <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2">
                            <span className="text-xs text-slate-400 font-medium">Zoom:</span>
                            <button
                                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                                disabled={zoomLevel <= 0.5}
                                className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-xs flex items-center justify-center"
                            >
                                −
                            </button>
                            <span className="text-xs text-blue-400 font-bold min-w-10 text-center">
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button
                                onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
                                disabled={zoomLevel >= 2.5}
                                className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-xs flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Chart Container */}
                <div className="bg-slate-800/50 rounded-2xl p-4 backdrop-blur-sm border border-slate-700">
                    <div className="flex overflow-x-auto">
                        {/* Task Labels - Sticky */}
                        <div className="sticky left-0 z-10 bg-slate-800 rounded-lg mr-4 min-w-[200px] lg:min-w-[250px]">
                            <svg width={chartStartX} height={chartHeight} className="block">
                                {filteredData.map((task, index) => {
                                    const y = chartStartY + index * rowHeight
                                    const isSelected = expandedTask === task.id
                                    return (
                                        <g key={`label-${task.id}`}>
                                            <rect
                                                x={10}
                                                y={y - 10}
                                                width={chartStartX - 20}
                                                height={45}
                                                fill={isSelected ? "rgba(59, 130, 246, 0.1)" : "rgba(148, 163, 184, 0.05)"}
                                                stroke={task.color}
                                                strokeWidth={isSelected ? "2" : "1"}
                                                rx="8"
                                                className="cursor-pointer transition-all duration-300"
                                                onClick={() => {
                                                    setExpandedTask(expandedTask === task.id ? null : task.id)
                                                    const { x } = getTaskPosition(task.startYear, task.endYear)
                                                    scrollContainerRef.current?.scrollTo({
                                                        left: Math.max(0, x - 100),
                                                        behavior: "smooth",
                                                    })
                                                }}
                                            />
                                            <text
                                                x={20}
                                                y={y + 5}
                                                fontSize="12"
                                                fontWeight="600"
                                                fill="white"
                                                className="pointer-events-none select-none"
                                            >
                                                {task.icon} {task.title.length > 18 ? task.title.substring(0, 18) + '...' : task.title}
                                            </text>
                                            <text
                                                x={20}
                                                y={y + 20}
                                                fontSize="10"
                                                fill="rgb(148, 163, 184)"
                                                className="pointer-events-none select-none"
                                            >
                                                {task.location.length > 25 ? task.location.substring(0, 25) + '...' : task.location}
                                            </text>
                                        </g>
                                    )
                                })}
                            </svg>
                        </div>

                        {/* Timeline Chart - Scrollable */}
                        <div className="overflow-x-auto flex-1" ref={scrollContainerRef}>
                            <svg width={chartWidth + 50} height={chartHeight} className="block">
                                <defs>
                                    <linearGradient id="educationGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0" stopColor="#3b82f6" stopOpacity="0.8" />
                                        <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.8" />
                                    </linearGradient>
                                    <linearGradient id="workGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0" stopColor="#10b981" stopOpacity="0.8" />
                                        <stop offset="1" stopColor="#06b6d4" stopOpacity="0.8" />
                                    </linearGradient>
                                </defs>

                                {/* Timeline Header */}
                                <rect
                                    x={0}
                                    y={0}
                                    width={chartWidth}
                                    height={chartStartY - 20}
                                    fill="rgba(30, 41, 59, 0.3)"
                                    stroke="rgba(148, 163, 184, 0.1)"
                                />

                                {/* Month Headers */}
                                {timelineMonths.map((month, index) => (
                                    <g key={index}>
                                        {month.isYearStart && (
                                            <rect
                                                x={index * monthWidth}
                                                y={30}
                                                width={monthWidth * 12}
                                                height={30}
                                                fill="rgba(59, 130, 246, 0.1)"
                                                stroke="rgba(59, 130, 246, 0.3)"
                                                rx="4"
                                            />
                                        )}
                                        <text
                                            x={index * monthWidth + monthWidth / 2}
                                            y={month.isYearStart ? 48 : 75}
                                            textAnchor="middle"
                                            fontSize={month.isYearStart ? "12" : "10"}
                                            fontWeight={month.isYearStart ? "600" : "400"}
                                            fill={month.isYearStart ? "#60a5fa" : "rgb(148, 163, 184)"}
                                        >
                                            {month.isYearStart ? month.label.split(" ")[1] : month.label.split(" ")[0]}
                                        </text>
                                        <line
                                            x1={index * monthWidth}
                                            y1={0}
                                            x2={index * monthWidth}
                                            y2={chartHeight - 30}
                                            stroke="rgba(148, 163, 184, 0.1)"
                                            strokeWidth="1"
                                            strokeDasharray={month.isYearStart ? "none" : "2,2"}
                                        />
                                    </g>
                                ))}

                                {/* Current Time Indicator */}
                                <g>
                                    <line
                                        x1={getCurrentTimePosition()}
                                        y1={chartStartY - 20}
                                        x2={getCurrentTimePosition()}
                                        y2={chartHeight - 30}
                                        stroke="#ef4444"
                                        strokeWidth={2 * zoomLevel}
                                    />
                                    <text
                                        x={getCurrentTimePosition() + 8 * zoomLevel}
                                        y={90}
                                        fontSize={10 * Math.max(0.8, zoomLevel)}
                                        fontWeight="600"
                                        fill="#ef4444"
                                    >
                                        NOW
                                    </text>
                                </g>

                                {/* Task Rows */}
                                {filteredData.map((task, index) => {
                                    const y = chartStartY + index * rowHeight
                                    const { x, width } = getTaskPosition(task.startYear, task.endYear)
                                    const isExpanded = expandedTask === task.id
                                    const isHovered = hoveredTask === task.id

                                    return (
                                        <g key={task.id}>
                                            {/* Row background */}
                                            <rect
                                                x={0}
                                                y={y - 15}
                                                width={chartWidth}
                                                height={rowHeight}
                                                fill={index % 2 === 0 ? "rgba(30, 41, 59, 0.2)" : "rgba(30, 41, 59, 0.4)"}
                                                stroke="rgba(148, 163, 184, 0.05)"
                                            />

                                            {/* Task Bar */}
                                            <rect
                                                x={x}
                                                y={y - 5}
                                                width={width}
                                                height={35}
                                                fill={task.type === "education" ? "url(#educationGrad)" : "url(#workGrad)"}
                                                stroke={task.color}
                                                strokeWidth={isExpanded || isHovered ? "2" : "1"}
                                                rx="17"
                                                className="cursor-pointer transition-all duration-300"
                                                style={{
                                                    opacity: isExpanded || isHovered ? 1 : 0.9,
                                                }}
                                                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                                                onMouseEnter={() => setHoveredTask(task.id)}
                                                onMouseLeave={() => setHoveredTask(null)}
                                            />

                                            {/* Task Duration */}
                                            <text
                                                x={x + width / 2}
                                                y={y + 15}
                                                textAnchor="middle"
                                                fontSize="10"
                                                fontWeight="500"
                                                fill="white"
                                                className="pointer-events-none"
                                            >
                                                {task.year.split(" - ")[0]} - {task.year.split(" - ")[1]}
                                            </text>
                                        </g>
                                    )
                                })}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Task Details */}
                {expandedTask && (
                    <div className="mt-8 bg-slate-800/80 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        {(() => {
                            const task = timelineData.find((t) => t.id === expandedTask)
                            if (!task) return null

                            return (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-white">
                                            {task.icon} {task.title}
                                        </h3>
                                        <button
                                            onClick={() => setExpandedTask(null)}
                                            className="text-slate-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-slate-300 text-sm">
                                            📍 {task.location} • 📅 {task.year}
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4">
                                                🎯 Key Achievements
                                            </h4>
                                            <ul className="space-y-3">
                                                {task.highlights.map((highlight, idx) => (
                                                    <li key={idx} className="text-slate-300 text-sm flex items-start">
                                                        <span className="text-blue-400 mr-3 mt-1 font-bold">•</span>
                                                        {highlight}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4">
                                                💪 Skills Developed
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {task.skills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 text-xs bg-slate-700 text-slate-200 rounded-full border border-slate-600"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </div>
                )}

                {!expandedTask && (
                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            💡 Click on any task bar to view detailed information • Use filters to focus on specific project types
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
