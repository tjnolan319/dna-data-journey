import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SkillVennDiagram = () => {
    const [selectedState, setSelectedState] = React.useState(null);
    const [isDarkMode, setIsDarkMode] = React.useState(true);
    const [hasBeenClicked, setHasBeenClicked] = React.useState(false);

    React.useEffect(() => {
        const checkDarkMode = () => {
            const isDark =
                document.documentElement.classList.contains("dark") ||
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDarkMode(isDark);
        };

        checkDarkMode();
        window.addEventListener("storage", checkDarkMode);

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            window.removeEventListener("storage", checkDarkMode);
            observer.disconnect();
        };
    }, []);

    const textColor = isDarkMode ? "#ffffff" : "#1f2937";

    const skills = {
        marketing: {
            name: "Marketing",
            color: "#09F",
            cx: 150,
            cy: 170,
            textX: 120,
            textY: 200,
            subtitle:
                "Strategic brand building through compelling storytelling, market positioning, and customer journey optimization. Crafting campaigns that resonate with target audiences while driving measurable engagement, conversion, and long-term brand loyalty through creative execution and strategic communication.",
        },
        psychology: {
            name: "Psychology",
            color: "#F90",
            cx: 250,
            cy: 170,
            textX: 280,
            textY: 200,
            subtitle:
                "Understanding the underlying drivers of human behavior, motivation, and decision-making processes. Applying cognitive science principles to predict how people think, feel, and act, enabling the design of experiences and interventions that genuinely influence behavior and create meaningful connections.",
        },
        analytics: {
            name: "Analytics",
            color: "#0F9",
            cx: 200,
            cy: 110,
            textX: 200,
            textY: 75,
            subtitle:
                "Transforming raw data into actionable insights through statistical analysis, pattern recognition, and predictive modeling. Using quantitative methods to uncover hidden trends, measure performance, and forecast outcomes that inform strategic decision-making and drive measurable business results.",
        },
    };

    const intersections = {
        "marketing-psychology": {
            title: "Where Marketing meets Psychology",
            subtitle:
                "Behavioral Marketing - Using psychological insights to craft campaigns that tap into emotional triggers, cognitive biases, and decision-making patterns. Creating persuasive messaging that resonates on a deeper level by understanding what truly motivates your audience to take action.",
            skills: ["marketing", "psychology"],
        },
        "psychology-analytics": {
            title: "Where Psychology meets Analytics",
            subtitle:
                "Behavioral Analytics - Measuring and predicting human behavior through data science and psychological research. Uncovering the 'why' behind user actions by combining quantitative metrics with qualitative behavioral insights to create more accurate models of human decision-making.",
            skills: ["psychology", "analytics"],
        },
        "marketing-analytics": {
            title: "Where Marketing meets Analytics",
            subtitle:
                "Data-Driven Marketing - Performance marketing that uses analytics to optimize campaigns, measure ROI, and predict customer lifetime value. Turning marketing intuition into measurable strategies through A/B testing, attribution modeling, and conversion optimization.",
            skills: ["marketing", "analytics"],
        },
    };

    const tripleOverlap = {
        key: "marketing-psychology-analytics",
        title: "Where Marketing, Psychology, and Analytics Meet",
        subtitle:
            "The intersection of all three disciplines creates a comprehensive approach that leverages storytelling, human behavior insights, and data-driven analysis to craft strategies that are both empathetic and effective. This synergy drives innovative solutions grounded in understanding, persuasion, and measurable impact.",
        skills: ["marketing", "psychology", "analytics"],
    };

    const getSVGCoordinates = (event, svgElement) => {
        const rect = svgElement.getBoundingClientRect();
        const scaleX = 400 / rect.width;
        const scaleY = 320 / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        return { x, y };
    };

    const getDistance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    const getCirclesContainingPoint = (x, y) => {
        const radius = 90;
        const containingCircles = [];

        Object.entries(skills).forEach(([key, skill]) => {
            const distance = getDistance(x, y, skill.cx, skill.cy);
            if (distance <= radius) {
                containingCircles.push(key);
            }
        });

        return containingCircles;
    };

    const getIntersectionKey = (circles) => {
        if (circles.length !== 2) return null;

        const sorted = circles.sort();
        if (sorted[0] === "marketing" && sorted[1] === "psychology")
            return "marketing-psychology";
        if (sorted[0] === "analytics" && sorted[1] === "psychology")
            return "psychology-analytics";
        if (sorted[0] === "analytics" && sorted[1] === "marketing")
            return "marketing-analytics";

        return null;
    };

    const handleSVGClick = (event) => {
        setHasBeenClicked(true);
        const svgElement = event.currentTarget;
        const { x, y } = getSVGCoordinates(event, svgElement);
        const containingCircles = getCirclesContainingPoint(x, y);

        if (containingCircles.length === 0) {
            setSelectedState(null);
        } else if (containingCircles.length === 1) {
            const skillKey = containingCircles[0];
            setSelectedState((prev) => (prev === skillKey ? null : skillKey));
        } else if (containingCircles.length === 2) {
            const intersectionKey = getIntersectionKey(containingCircles);
            if (intersectionKey) {
                setSelectedState((prev) =>
                    prev === intersectionKey ? null : intersectionKey
                );
            }
        } else if (containingCircles.length === 3) {
            setSelectedState((prev) =>
                prev === tripleOverlap.key ? null : tripleOverlap.key
            );
        }
    };

    const getCircleOpacity = (skillKey) => {
        if (selectedState === null) return 0.4;
        if (selectedState === skillKey) return 0.6;
        if (intersections[selectedState]?.skills.includes(skillKey)) return 0.6;
        if (
            selectedState === tripleOverlap.key &&
            tripleOverlap.skills.includes(skillKey)
        )
            return 0.6;
        return 0.15;
    };

    const getCircleRadius = (skillKey) => {
        if (selectedState === skillKey) return 110;
        if (intersections[selectedState]?.skills.includes(skillKey)) return 105;
        if (
            selectedState === tripleOverlap.key &&
            tripleOverlap.skills.includes(skillKey)
        )
            return 105;
        return 90;
    };

    const getTextOpacity = (skillKey) => {
        if (selectedState === null) return 1;
        if (selectedState === skillKey) return 1;
        if (intersections[selectedState]?.skills.includes(skillKey)) return 1;
        if (
            selectedState === tripleOverlap.key &&
            tripleOverlap.skills.includes(skillKey)
        )
            return 1;
        return 0.4;
    };

    const getTextSize = (skillKey) => {
        if (selectedState === skillKey) return 16;
        if (intersections[selectedState]?.skills.includes(skillKey)) return 15;
        if (
            selectedState === tripleOverlap.key &&
            tripleOverlap.skills.includes(skillKey)
        )
            return 15;
        return 14;
    };

    const renderColoredTitle = (title) => {
        const skillNameToKey = {
            marketing: "marketing",
            psychology: "psychology",
            analytics: "analytics",
        };

        const parts = title.split(" ");

        return (
            <h3 style={{ margin: "0 0 8px 0", color: textColor }}>
                {parts
                    .map((part, index) => {
                        const cleanPart = part
                            .replace(/[^\w]/g, "")
                            .toLowerCase();
                        if (skillNameToKey[cleanPart]) {
                            const skillKey = skillNameToKey[cleanPart];
                            return (
                                <span
                                    key={index}
                                    style={{ color: skills[skillKey].color }}
                                >
                                    {part}
                                </span>
                            );
                        }
                        return <span key={index}>{part}</span>;
                    })
                    .reduce(
                        (prev, curr, index) =>
                            index === 0 ? [curr] : [...prev, " ", curr],
                        []
                    )}
            </h3>
        );
    };

    return (
        <motion.div
            style={{
                width: "100%",
                maxWidth: 600,
                margin: "0 auto",
                padding: 20,
                textAlign: "center",
                color: textColor,
                position: "relative",
            }}
        >
            <h2 style={{ marginBottom: 20 }}>Interdisciplinary Strengths</h2>
            <svg
                width="100%"
                viewBox="0 0 400 320"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: "pointer" }}
                onClick={handleSVGClick}
            >
                {Object.entries(skills).map(([key, skill]) => (
                    <motion.circle
                        key={key}
                        cx={skill.cx}
                        cy={skill.cy}
                        r={90}
                        fill={skill.color}
                        fillOpacity={getCircleOpacity(key)}
                        style={{ cursor: "pointer" }}
                        animate={{ r: getCircleRadius(key) }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                ))}

                {Object.entries(skills).map(([key, skill]) => (
                    <motion.text
                        key={`text-${key}`}
                        x={skill.textX}
                        y={skill.textY}
                        fontSize="14"
                        fill="currentColor"
                        textAnchor="middle"
                        style={{ userSelect: "none", pointerEvents: "none" }}
                        animate={{
                            opacity: getTextOpacity(key),
                            fontSize: getTextSize(key),
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {skill.name}
                    </motion.text>
                ))}

                <motion.g
                    style={{ pointerEvents: "none" }}
                    animate={{ opacity: selectedState === null ? 1 : 0.6 }}
                    transition={{ duration: 0.3 }}
                >
                    <text
                        x="200"
                        y="150"
                        fontSize="12"
                        fill="currentColor"
                        textAnchor="middle"
                        fontWeight="bold"
                        style={{ userSelect: "none" }}
                    >
                        Behavior-Informed
                    </text>
                    <text
                        x="200"
                        y="170"
                        fontSize="12"
                        fill="currentColor"
                        textAnchor="middle"
                        fontWeight="bold"
                        style={{ userSelect: "none" }}
                    >
                        Data-Driven Strategy
                    </text>
                </motion.g>

                {!hasBeenClicked && (
                    <g transform="translate(260, 90)">
                        <text fontSize="12" fill={textColor} fontStyle="italic">
                            click me
                        </text>
                        <text y="14" fontSize="16" fill={textColor}>
                            ↓
                        </text>
                    </g>
                )}
            </svg>

            <motion.div
                style={{
                    marginTop: 20,
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                animate={{
                    opacity: selectedState ? 1 : 0,
                    y: selectedState ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
            >
                {selectedState && (
                    <div>
                        {skills[selectedState] && (
                            <>
                                <h3
                                    style={{
                                        margin: "0 0 8px 0",
                                        color: skills[selectedState].color,
                                    }}
                                >
                                    {skills[selectedState].name}
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        opacity: 0.8,
                                        lineHeight: "1.4",
                                        maxWidth: "500px",
                                    }}
                                >
                                    {skills[selectedState].subtitle}
                                </p>
                            </>
                        )}

                        {intersections[selectedState] && (
                            <>
                                {renderColoredTitle(
                                    intersections[selectedState].title
                                )}
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        opacity: 0.8,
                                        lineHeight: "1.4",
                                        maxWidth: "500px",
                                    }}
                                >
                                    {intersections[selectedState].subtitle}
                                </p>
                            </>
                        )}

                        {selectedState === tripleOverlap.key && (
                            <>
                                {renderColoredTitle(tripleOverlap.title)}
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        opacity: 0.8,
                                        lineHeight: "1.4",
                                        maxWidth: "500px",
                                    }}
                                >
                                    {tripleOverlap.subtitle}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const PortfolioSkillsDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Portfolio</span>
                    </Button>
                </div>

                <div className="space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">
                            Interdisciplinary Strengths <span className="text-blue-600">Venn-Diagram</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                           Interactive visualization mapping skillsets across Marketing, Psychology, and Analytics
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="h-full bg-black">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-white">
                                          <span>Interdisciplinary Strengths Venn-Diagram</span>
                                    </CardTitle>
                                    <CardDescription className="text-gray-300">
                                        Click on any section to explore the unique value proposition of each skill and their intersections.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SkillVennDiagram />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skills Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-2">Core Disciplines</h4>
                                        <p className="text-sm text-slate-600">
                                            Three foundational areas that create a unique professional profile: Marketing for strategy and communication, Psychology for behavioral insights, and Analytics for data-driven decision making.
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-2">Interactive Experience</h4>
                                        <p className="text-sm text-slate-600">
                                            Explore individual skills or their intersections to understand how these disciplines complement each other in real-world applications.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-2">Unique Value</h4>
                                        <p className="text-sm text-slate-600">
                                            The combination of all three creates "Behavior-Informed Data-Driven Strategy" - the sweet spot where empathy meets evidence.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Technical Implementation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-sm text-slate-700 mb-2">Built With:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['React', 'Framer Motion', 'Interactive SVG', 'TypeScript', 'Responsive Design'].map((tech) => (
                                                    <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t">
                                            <p className="text-sm font-medium text-green-600">
                                                Demonstrates ability to create engaging, interactive visualizations
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Applications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div>• Customer Journey Optimization</div>
                                        <div>• Behavioral Campaign Design</div>
                                        <div>• Predictive User Analytics</div>
                                        <div>• Conversion Rate Optimization</div>
                                        <div>• Market Research & Insights</div>
                                        <div>• Strategic Brand Positioning</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioSkillsDashboard;
