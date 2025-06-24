
import React, { useState, useEffect, useRef } from "react"

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]

// Helper function to convert year and month to decimal
const getYearMonth = (year: number, month: number) => {
    // month should be 1-12 (Jan=1, Feb=2, etc.)
    return year + (month - 1) / 12
}

const timelineData = [
    {
        id: 1,
        title: "Bachelor's Degrees",
        type: "education",
        icon: "🎓",
        startYear: getYearMonth(2020, 9), // Sept 2020
        endYear: getYearMonth(2023, 5), // May 2023
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
        startYear: getYearMonth(2021, 6), // June 2021
        endYear: getYearMonth(2023, 5), // May 2023
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
        startYear: getYearMonth(2022, 1), // Jan 2022
        endYear: getYearMonth(2023, 5), // May 2023
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
        startYear: getYearMonth(2021, 6), // June 2021
        endYear: getYearMonth(2023, 10), // Oct 2023
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
        startYear: getYearMonth(2023, 10), // Oct 2023
        endYear: getYearMonth(2024, 3), // Mar 2024
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
        startYear: getYearMonth(2023, 9), // Sept 2023
        endYear: getYearMonth(2025, 5), // May 2025
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
        startYear: getYearMonth(2024, 8), // Aug 2024
        endYear: getYearMonth(2025, 5), // May 2025
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
const baseMonthWidth = 60
const rowHeight = 80
const chartStartX = 300
const chartStartY = 150

export const GanttChart = () => {
    const [expandedTask, setExpandedTask] = useState<number | null>(null)
    const [hoveredTask, setHoveredTask] = useState<number | null>(null)
    const [filterType, setFilterType] = useState("all")
    const [particles, setParticles] = useState<any[]>([])
    const [currentTime, setCurrentTime] = useState(getYearMonth(2025, 6)) // Current time indicator (June 2025)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [zoomLevel, setZoomLevel] = useState(1) // 1 = normal, 1.5 = zoomed in, 0.5 would be zoomed out
    const monthWidth = baseMonthWidth * zoomLevel
    const chartWidth = timelineMonths.length * monthWidth
    const chartHeight = timelineData.length * rowHeight + 200

    // Initialize DNA particles
    useEffect(() => {
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * (chartStartX + chartWidth),
            y: Math.random() * chartHeight,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.3 + 0.1,
            color:
                i % 4 === 0
                    ? "#667eea"
                    : i % 4 === 1
                      ? "#48bb78"
                      : i % 4 === 2
                        ? "#ed8936"
                        : "#f093fb",
        }))
        setParticles(newParticles)
    }, [chartWidth, chartHeight])

    // Animate particles
    useEffect(() => {
        const animateParticles = () => {
            setParticles((prev) =>
                prev.map((particle) => ({
                    ...particle,
                    y:
                        particle.y - particle.speed < 0
                            ? chartHeight
                            : particle.y - particle.speed,
                }))
            )
        }
        const interval = setInterval(animateParticles, 100)
        return () => clearInterval(interval)
    }, [chartHeight])

    const filteredData = timelineData.filter(
        (item) => filterType === "all" || item.type === filterType
    )
    const getTaskPosition = (startYear: number, endYear: number) => {
        const startIndex =
            timelineMonths.findIndex((m) => m.value > startYear) - 1
        const endIndex = timelineMonths.findIndex((m) => m.value > endYear) - 1

        const adjustedStartIndex = startIndex < 0 ? 0 : startIndex
        const adjustedEndIndex =
            endIndex < 0 ? timelineMonths.length - 1 : endIndex

        const x = adjustedStartIndex * monthWidth
        const width = (adjustedEndIndex - adjustedStartIndex + 1) * monthWidth

        return { x, width: Math.max(width, monthWidth) }
    }

    const getCurrentTimePosition = () => {
        const currentIndex = timelineMonths.findIndex(
            (m) => m.value >= currentTime
        )
        return currentIndex >= 0
            ? currentIndex * monthWidth
            : timelineMonths.length * monthWidth
    }

    return (
        <section id="gantt" className="py-20">
            <div
                style={{
                    padding: "20px",
                    fontFamily: "system-ui, sans-serif",
                    background:
                        "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    minHeight: "100vh",
                    color: "white",
                    position: "relative",
                    overflow: "auto",
                }}
            >
                {/* DNA Particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        style={{
                            position: "absolute",
                            left: particle.x,
                            top: particle.y,
                            width: particle.size,
                            height: particle.size,
                            borderRadius: "50%",
                            background:
                                particle.color +
                                Math.floor(particle.opacity * 255)
                                    .toString(16)
                                    .padStart(2, "0"),
                            pointerEvents: "none",
                            zIndex: 1,
                            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
                        }}
                    />
                ))}

                {/* Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "40px",
                        zIndex: 10,
                        position: "relative",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "42px",
                            fontWeight: "800",
                            margin: "0 0 10px 0",
                            background:
                                "linear-gradient(45deg, #ffeaa7, #fab1a0, #fd79a8)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 4px 8px rgba(0,0,0,0.5)",
                        }}
                    >
                        🧬 Career DNA Project Timeline
                    </h1>
                    <p
                        style={{
                            fontSize: "18px",
                            color: "rgba(255,255,255,0.8)",
                            margin: "0",
                        }}
                    >
                        Professional journey mapped in project management style
                    </p>

                    {/* Controls */}
                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            justifyContent: "center",
                            marginTop: "20px",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        {["all", "education", "work"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setFilterType(filter)}
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    border: "2px solid",
                                    borderColor:
                                        filterType === filter
                                            ? "#ffeaa7"
                                            : "rgba(255,255,255,0.3)",
                                    borderRadius: "25px",
                                    background:
                                        filterType === filter
                                            ? "rgba(255,234,167,0.2)"
                                            : "rgba(255,255,255,0.1)",
                                    color:
                                        filterType === filter
                                            ? "#ffeaa7"
                                            : "rgba(255,255,255,0.8)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                {filter === "all"
                                    ? "🌟 All Projects"
                                    : filter === "education"
                                      ? "🎓 Education"
                                      : "💼 Work"}
                            </button>
                        ))}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginLeft: "20px",
                                padding: "8px 16px",
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: "25px",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.2)",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "rgba(255,255,255,0.8)",
                                    fontWeight: "600",
                                }}
                            >
                                🔍 Zoom:
                            </span>
                            <button
                                onClick={() =>
                                    setZoomLevel(Math.max(0.5, zoomLevel - 0.25))
                                }
                                disabled={zoomLevel <= 0.5}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    border: "none",
                                    borderRadius: "50%",
                                    background:
                                        zoomLevel <= 0.5
                                            ? "rgba(255,255,255,0.1)"
                                            : "rgba(255,255,255,0.2)",
                                    color:
                                        zoomLevel <= 0.5
                                            ? "rgba(255,255,255,0.4)"
                                            : "rgba(255,255,255,0.9)",
                                    cursor:
                                        zoomLevel <= 0.5
                                            ? "not-allowed"
                                            : "pointer",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                −
                            </button>
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "#ffeaa7",
                                    fontWeight: "700",
                                    minWidth: "40px",
                                    textAlign: "center",
                                }}
                            >
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button
                                onClick={() =>
                                    setZoomLevel(Math.min(2.5, zoomLevel + 0.25))
                                }
                                disabled={zoomLevel >= 2.5}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    border: "none",
                                    borderRadius: "50%",
                                    background:
                                        zoomLevel >= 2.5
                                            ? "rgba(255,255,255,0.1)"
                                            : "rgba(255,255,255,0.2)",
                                    color:
                                        zoomLevel >= 2.5
                                            ? "rgba(255,255,255,0.4)"
                                            : "rgba(255,255,255,0.9)",
                                    cursor:
                                        zoomLevel >= 2.5
                                            ? "not-allowed"
                                            : "pointer",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Chart Container */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "20px",
                        backdropFilter: "blur(15px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "20px",
                        overflowX: "auto",
                        position: "relative",
                        zIndex: 5,
                        display: "flex",
                    }}
                >
                    <div
                        style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 10,
                            background: "rgba(15, 52, 96, 0.95)",
                            borderRadius: "15px",
                            marginRight: "10px",
                        }}
                    >
                        <svg
                            width={chartStartX}
                            height={chartHeight}
                            style={{ display: "block" }}
                        >
                            {/* Task Labels Only */}
                            {filteredData.map((task, index) => {
                                const y = chartStartY + index * rowHeight
                                const isSelected = expandedTask === task.id
                                return (
                                    <g key={`label-${task.id}`}>
                                        <rect
                                            x={10}
                                            y={y + 5}
                                            width={chartStartX - 30}
                                            height={50}
                                            fill={
                                                isSelected
                                                    ? "rgba(255,255,255,0.2)"
                                                    : "rgba(255,255,255,0.1)"
                                            }
                                            stroke={task.color}
                                            strokeWidth={isSelected ? "3" : "2"}
                                            rx="12"
                                            style={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                console.log(
                                                    "Clicked task:",
                                                    task.id,
                                                    task.title
                                                )
                                                setExpandedTask(
                                                    expandedTask === task.id
                                                        ? null
                                                        : task.id
                                                )
                                                const { x } = getTaskPosition(
                                                    task.startYear,
                                                    task.endYear
                                                )
                                                if (scrollContainerRef.current) {
                                                    scrollContainerRef.current.scrollTo(
                                                        {
                                                            left: Math.max(0, x),
                                                            behavior: "smooth",
                                                        }
                                                    )
                                                }
                                            }}
                                        />
                                        <text
                                            x={25}
                                            y={y + 25}
                                            fontSize="14"
                                            fontWeight="700"
                                            fill="white"
                                            style={{
                                                pointerEvents: "none",
                                                userSelect: "none",
                                            }}
                                        >
                                            {task.icon} {task.title}
                                        </text>
                                        <text
                                            x={25}
                                            y={y + 40}
                                            fontSize="11"
                                            fill="rgba(255,255,255,0.7)"
                                            style={{
                                                pointerEvents: "none",
                                                userSelect: "none",
                                            }}
                                        >
                                            {task.location}
                                        </text>
                                    </g>
                                )
                            })}
                        </svg>
                    </div>
                    <div style={{ overflowX: "auto" }} ref={scrollContainerRef}>
                        <svg
                            width={chartWidth + 50}
                            height={chartHeight}
                            style={{ display: "block" }}
                        >
                            <defs>
                                <linearGradient
                                    id="educationGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0"
                                        stopColor="#667eea"
                                        stopOpacity="0.8"
                                    />
                                    <stop
                                        offset="1"
                                        stopColor="#764ba2"
                                        stopOpacity="0.8"
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="workGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0"
                                        stopColor="#48bb78"
                                        stopOpacity="0.8"
                                    />
                                    <stop
                                        offset="1"
                                        stopColor="#38a169"
                                        stopOpacity="0.8"
                                    />
                                </linearGradient>
                                <pattern
                                    id="dnaPattern"
                                    x="0"
                                    y="0"
                                    width="20"
                                    height="20"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <circle
                                        cx="5"
                                        cy="5"
                                        r="2"
                                        fill="rgba(255,255,255,0.1)"
                                    />
                                    <circle
                                        cx="15"
                                        cy="15"
                                        r="2"
                                        fill="rgba(255,255,255,0.1)"
                                    />
                                    <path
                                        d="M5,5 Q10,15 15,15"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                </pattern>
                                <filter id="glow">
                                    <feGaussianBlur
                                        stdDeviation="3"
                                        result="coloredBlur"
                                    />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Timeline Header */}
                            <rect
                                x={0}
                                y={0}
                                width={chartWidth}
                                height={chartStartY - 20}
                                fill="rgba(255,255,255,0.05)"
                                stroke="rgba(255,255,255,0.1)"
                            />

                            {/* Month Headers */}
                            {timelineMonths.map((month, index) => {
                                // Calculate how many months from this year start to end of timeline
                                const yearStartIndex = timelineMonths.findIndex(
                                    (m) =>
                                        m.label.split(" ")[1] ===
                                            month.label.split(" ")[1] &&
                                        m.label.split(" ")[0] === "Jan"
                                )
                                const yearEndIndex = timelineMonths.findIndex(
                                    (m) =>
                                        m.label.split(" ")[1] ===
                                            month.label.split(" ")[1] &&
                                        m.label.split(" ")[0] === "Dec"
                                )

                                let rectWidth
                                if (index === 0) {
                                    // First partial year
                                    rectWidth = monthWidth * 4
                                } else if (month.isYearStart) {
                                    // Full year or remaining months
                                    const monthsInYear =
                                        yearEndIndex >= 0
                                            ? yearEndIndex - yearStartIndex + 1
                                            : timelineMonths.length - yearStartIndex
                                    rectWidth = monthWidth * monthsInYear
                                }

                                return (
                                    <g key={index}>
                                        {(month.isYearStart || index === 0) && (
                                            <rect
                                                x={index * monthWidth}
                                                y={50}
                                                width={rectWidth}
                                                height={55}
                                                fill="rgba(255,234,167,0.1)"
                                                stroke="rgba(255,234,167,0.3)"
                                                rx="8"
                                            />
                                        )}
                                        <text
                                            x={index * monthWidth + monthWidth / 2}
                                            y={
                                                month.isYearStart || index === 0
                                                    ? 75
                                                    : 95
                                            }
                                            textAnchor="middle"
                                            fontSize={
                                                month.isYearStart || index === 0
                                                    ? "14"
                                                    : "11"
                                            }
                                            fontWeight={
                                                month.isYearStart || index === 0
                                                    ? "700"
                                                    : "500"
                                            }
                                            fill={
                                                month.isYearStart || index === 0
                                                    ? "#ffeaa7"
                                                    : "rgba(255,255,255,0.7)"
                                            }
                                        >
                                            {month.isYearStart || index === 0
                                                ? month.label.split(" ")[1]
                                                : month.label.split(" ")[0]}
                                        </text>
                                        {(index === 0 || month.isYearStart) && (
                                            <text
                                                x={
                                                    index * monthWidth +
                                                    monthWidth / 2
                                                }
                                                y={95}
                                                textAnchor="middle"
                                                fontSize="11"
                                                fontWeight="500"
                                                fill="rgba(255,255,255,0.7)"
                                            >
                                                {month.label.split(" ")[0]}
                                            </text>
                                        )}
                                        <line
                                            x1={index * monthWidth}
                                            y1={0}
                                            x2={index * monthWidth}
                                            y2={chartHeight - 50}
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="1"
                                            strokeDasharray={
                                                month.isYearStart ? "none" : "2,2"
                                            }
                                        />
                                    </g>
                                )
                            })}

                            {/* Current Time Indicator */}
                            <g>
                                <line
                                    x1={getCurrentTimePosition()}
                                    y1={chartStartY - 20}
                                    x2={getCurrentTimePosition()}
                                    y2={chartHeight - 50}
                                    stroke="#ff6b6b"
                                    strokeWidth={3 * zoomLevel}
                                    filter="url(#glow)"
                                />
                                <text
                                    x={getCurrentTimePosition() + 14 * zoomLevel}
                                    y={120}
                                    fontSize={12 * Math.max(0.8, zoomLevel)}
                                    fontWeight="700"
                                    fill="#ff6b6b"
                                >
                                    NOW
                                </text>
                            </g>

                            {/* Task Rows */}
                            {filteredData.map((task, index) => {
                                const y = chartStartY + index * rowHeight
                                const { x, width } = getTaskPosition(
                                    task.startYear,
                                    task.endYear
                                )
                                const isExpanded = expandedTask === task.id
                                const isHovered = hoveredTask === task.id

                                return (
                                    <g key={task.id}>
                                        {/* Row background */}
                                        <rect
                                            x={0}
                                            y={y - 10}
                                            width={chartWidth}
                                            height={rowHeight}
                                            fill={
                                                index % 2 === 0
                                                    ? "rgba(255,255,255,0.02)"
                                                    : "rgba(255,255,255,0.05)"
                                            }
                                            stroke="rgba(255,255,255,0.1)"
                                        />

                                        {/* Task Bar */}
                                        <rect
                                            x={x}
                                            y={y + 10}
                                            width={width}
                                            height={40}
                                            fill={
                                                task.type === "education"
                                                    ? "url(#educationGrad)"
                                                    : "url(#workGrad)"
                                            }
                                            stroke={task.color}
                                            strokeWidth={
                                                isExpanded || isHovered ? "3" : "2"
                                            }
                                            rx="20"
                                            filter="url(#glow)"
                                            style={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                opacity:
                                                    isExpanded || isHovered
                                                        ? 1
                                                        : 0.9,
                                            }}
                                            onClick={() =>
                                                setExpandedTask(
                                                    expandedTask === task.id
                                                        ? null
                                                        : task.id
                                                )
                                            }
                                            onMouseEnter={() =>
                                                setHoveredTask(task.id)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredTask(null)
                                            }
                                        />

                                        {/* DNA Pattern Overlay */}
                                        <rect
                                            x={x}
                                            y={y + 10}
                                            width={width}
                                            height={40}
                                            fill="url(#dnaPattern)"
                                            rx="20"
                                            style={{ pointerEvents: "none" }}
                                        />

                                        {/* Task Duration */}
                                        <text
                                            x={x + width / 2}
                                            y={y + 35}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fontWeight="600"
                                            fill="white"
                                            style={{ pointerEvents: "none" }}
                                        >
                                            {task.year.split(" - ")[0]} -{" "}
                                            {task.year.split(" - ")[1]}
                                        </text>
                                    </g>
                                )
                            })}
                        </svg>
                    </div>
                </div>

                {/* Legend or Task Details */}
                <div
                    style={{
                        marginTop: "30px",
                        padding: "20px",
                        background: expandedTask
                            ? "rgba(255,255,255,0.98)"
                            : "rgba(255,255,255,0.05)",
                        borderRadius: "15px",
                        backdropFilter: "blur(10px)",
                        border: expandedTask
                            ? `2px solid ${timelineData.find((t) => t.id === expandedTask)?.color}`
                            : "1px solid rgba(255,255,255,0.1)",
                        textAlign: expandedTask ? "left" : "center",
                        color: expandedTask ? "#2d3748" : "white",
                        minHeight: "120px",
                    }}
                >
                    {expandedTask ? (
                        (() => {
                            const task = timelineData.find(
                                (t) => t.id === expandedTask
                            )
                            if (!task) return null

                            return (
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: 0,
                                                color: task.color,
                                                fontSize: "20px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {task.icon} {task.title}
                                        </h3>
                                        <button
                                            onClick={() => setExpandedTask(null)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                fontSize: "24px",
                                                cursor: "pointer",
                                                color: "#666",
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div style={{ marginBottom: "20px" }}>
                                        <p
                                            style={{
                                                margin: "0 0 8px 0",
                                                fontSize: "14px",
                                                color: "#666",
                                            }}
                                        >
                                            📍 {task.location} • 📅 {task.year}
                                        </p>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "30px",
                                            flexWrap: "wrap",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <div
                                            style={{
                                                flex: "1",
                                                minWidth: "300px",
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    margin: "0 0 12px 0",
                                                    color: task.color,
                                                    fontSize: "16px",
                                                }}
                                            >
                                                🎯 Key Achievements
                                            </h4>
                                            <ul
                                                style={{
                                                    margin: "0",
                                                    paddingLeft: "20px",
                                                    listStyle: "none",
                                                }}
                                            >
                                                {task.highlights.map(
                                                    (highlight, idx) => (
                                                        <li
                                                            key={idx}
                                                            style={{
                                                                margin: "0 0 8px 0",
                                                                fontSize: "14px",
                                                                color: "#4a5568",
                                                                position:
                                                                    "relative",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    position:
                                                                        "absolute",
                                                                    left: "-16px",
                                                                    color: task.color,
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                •
                                                            </span>
                                                            {highlight}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div
                                            style={{
                                                flex: "1",
                                                minWidth: "300px",
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    margin: "0 0 12px 0",
                                                    color: task.color,
                                                    fontSize: "16px",
                                                }}
                                            >
                                                💪 Skills Developed
                                            </h4>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "8px",
                                                }}
                                            >
                                                {task.skills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            background:
                                                                task.color + "20",
                                                            color: task.color,
                                                            padding: "6px 14px",
                                                            borderRadius: "16px",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })()
                    ) : (
                        <p
                            style={{
                                margin: "40px 0",
                                fontSize: "16px",
                                color: "rgba(255,255,255,0.7)",
                                lineHeight: "1.4",
                            }}
                        >
                            🎮 Click on any task bar to view detailed information •
                            Use filters to focus on specific project types
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
