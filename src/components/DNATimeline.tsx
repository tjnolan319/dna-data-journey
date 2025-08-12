import React, { useState } from "react";
import {
  X,
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  Trophy,
  ArrowLeft,
} from "lucide-react";

// ---------- Types ----------
interface Course {
  code: string;
  name: string;
  credits?: number;
  grade?: string;
}

interface AwardItem {
  title: string;
  description?: string;
  date: string;
}

interface AcademicStats {
  gpa: number;
  totalCredits: number;
  completedCredits: number;
  honors?: string[];
}

interface SemesterData {
  id: string;
  semester: string;
  year: number;
  school: "URI" | "Bentley" | string;
  schoolName: string;
  color?: string;
  courses: Course[];
  semesterGPA?: number;
}

interface SchoolData {
  name: string;
  degree: string;
  period: string;
  stats: AcademicStats;
  awards: AwardItem[];
  semesters: SemesterData[];
}

// ---------- Helpers ----------
const gradeBadgeClass = (grade?: string) => {
  if (!grade) return "bg-gray-100 text-gray-800";
  if (grade === "A" || grade === "A+") return "bg-green-100 text-green-800";
  if (grade === "A-" || grade === "B+") return "bg-blue-100 text-blue-800";
  if (grade === "B" || grade === "B-") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

const getSchoolColors = (schoolName: string) => {
  // Bentley: Deep blue & warm gold with better contrast
  if (schoolName.toLowerCase().includes("bentley")) {
    return {
      navy: "#1e3a8a",
      gold: "#fbbf24",
      gradientStart: "#1e3a8a",
      gradientEnd: "#3b82f6",
      cardAccent: "#dbeafe",
      buttonStart: "#1e40af",
      buttonEnd: "#3b82f6",
      textNavy: "#1e3a8a",
    };
  }

  // URI: Ocean blue & navy with improved readability
  if (schoolName.toLowerCase().includes("rhode island") || schoolName.toLowerCase().includes("uri")) {
    return {
      navy: "#1e40af",
      lightBlue: "#3b82f6",
      gradientStart: "#3b82f6",
      gradientEnd: "#1e40af",
      cardAccent: "#eff6ff",
      buttonStart: "#2563eb",
      buttonEnd: "#1e40af",
      textNavy: "#1e40af",
    };
  }

  // default
  return {
    navy: "#1f2937",
    gold: "#f59e0b",
    gradientStart: "#3b82f6",
    gradientEnd: "#8b5cf6",
    cardAccent: "#f3f4f6",
    buttonStart: "#4f46e5",
    buttonEnd: "#06b6d4",
    textNavy: "#111827",
  };
};

// ---------- Modals ----------
const AllClassesModal = ({
  schoolData,
  isOpen,
  onClose,
}: {
  schoolData: SchoolData | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !schoolData) return null;
  const colors = getSchoolColors(schoolData.name);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="border-b px-6 py-4 flex items-start justify-between flex-shrink-0">
          <div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-slate-800">{schoolData.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{schoolData.degree} • {schoolData.period}</p>
            </div>
          </div>

          <div className="flex items-start">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-8">
            {schoolData.semesters.map((semester) => (
              <div key={semester.id} className="border rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-slate-800">{semester.semester} {semester.year}</h4>
                    {semester.semesterGPA && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">GPA: {semester.semesterGPA.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 mt-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">{semester.courses.length} courses</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {semester.courses.map((course, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border hover:shadow transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-slate-800">{course.code}</div>
                          {course.grade && (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${gradeBadgeClass(course.grade)}`}>{course.grade}</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{course.name}</div>
                        {course.credits && <div className="text-xs text-slate-500">Credits: {course.credits}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({
  semester,
  isOpen,
  onClose,
}: {
  semester: SemesterData | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !semester) return null;
  const colors = getSchoolColors(semester.schoolName);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">{semester.semester} {semester.year}</h3>
            <div className="flex items-center gap-4 mt-2 text-slate-600">
              <div className="flex items-center gap-2 font-medium text-[inherit]">
                <GraduationCap className="h-5 w-5 text-slate-700" />
                <span>{semester.schoolName}</span>
              </div>
              {semester.semesterGPA && (
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>Semester GPA: {semester.semesterGPA.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h4 className="font-semibold text-slate-800 mb-4 text-lg flex items-center gap-2"><BookOpen className="h-5 w-5" />All Courses ({semester.courses.length})</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {semester.courses.map((course, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border hover:shadow transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-slate-800">{course.code}</div>
                  {course.grade && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${gradeBadgeClass(course.grade)}`}>{course.grade}</span>
                  )}
                </div>
                <div className="text-sm text-slate-600 mb-2">{course.name}</div>
                {course.credits && <div className="text-xs text-slate-500">Credits: {course.credits}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- School Section ----------
const SchoolSection = ({
  schoolData,
  onSemesterClick,
  onViewAllClasses,
}: {
  schoolData: SchoolData;
  onSemesterClick: (semester: SemesterData) => void;
  onViewAllClasses: (schoolData: SchoolData) => void;
}) => {
  const colors = getSchoolColors(schoolData.name);
  const totalCourses = schoolData.semesters.reduce((t, s) => t + s.courses.length, 0);

  return (
    <div className="mb-12">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-xl shadow-lg border overflow-hidden">
          {/* Header */}
          <div
            className="p-6 text-white"
            style={{
              backgroundImage: `linear-gradient(90deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight">{schoolData.name}</h3>
                  <p className="mt-1 text-lg sm:text-xl font-semibold text-white/90">{schoolData.degree}</p>
                  <p className="mt-1 text-sm text-white/80">{schoolData.period}</p>
                </div>
              </div>

              {/* Academic Summary */}
              <div className="text-left sm:text-right">
                <h4 className="text-lg font-bold flex items-center justify-start sm:justify-end gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Academic Summary</span>
                </h4>
                <div className="mt-3 flex flex-col sm:items-end gap-2 text-white/95">
                  <div className="text-sm">GPA: <span className="font-semibold">{schoolData.stats.gpa.toFixed(2)}</span></div>
                  {schoolData.stats.honors && schoolData.stats.honors.map((h, i) => (
                    <div key={i} className="text-sm">{h}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body: Awards & CTA */}
          <div className="p-6 bg-white">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textNavy }}>
              <Trophy className="h-5 w-5" /> Awards & Recognition
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {schoolData.awards.map((award, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow transition-shadow bg-white">
                  <div className="flex items-start gap-3">
                    <Award className={`h-5 w-5 mt-1`} style={{ color: colors.textNavy }} />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{award.title}</div>
                      {award.description && <div className="text-xs text-slate-600 mt-1">{award.description}</div>}
                      <div className="pt-2 text-xs text-slate-500">{award.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">{totalCourses} courses across {schoolData.semesters.length} semesters</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewAllClasses(schoolData)}
                    className="inline-flex items-center px-4 py-2 font-semibold rounded-lg shadow hover:shadow-lg transition-all text-white"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${colors.buttonStart}, ${colors.buttonEnd})`,
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" /> View All Classes ({totalCourses})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export const DNATimeline = () => {
  const [selectedSemester, setSelectedSemester] = useState<SemesterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchoolForAllClasses, setSelectedSchoolForAllClasses] = useState<SchoolData | null>(null);
  const [isAllClassesModalOpen, setIsAllClassesModalOpen] = useState(false);

  const uriData: SchoolData = {
    name: "University of Rhode Island",
    degree: "Bachelor of Science in Marketing & Bachelor of Arts in Psychology",
    period: "2021 - 2023",
    stats: {
      gpa: 3.72,
      totalCredits: 120,
      completedCredits: 120,
      honors: ["Graduated on an accelerated 3-year track", "Dual bachelor's degrees"],
    },
    awards: [
      { title: "Summa Cum Laude", description: "Highest academic honors for undergraduate studies", date: "May 2023" },
      { title: "Dean's List", description: "6/6 semesters", date: "2021-2023" },
      { title: "Marketing Award for Scholastic Achievement & Service Excellence", description: "Recognized for outstanding academic performance and community service", date: "May 2023" },
    ],
    semesters: [
      { id: "1", semester: "Fall", year: 2021, school: "URI", schoolName: "University of Rhode Island", color: "#3b82f6", semesterGPA: 3.65, courses: [
        { code: "BAI 210", name: "Managerial Statistics I", credits: 3, grade: "A-" },
        { code: "MKT 265", name: "Marketing Principles", credits: 3, grade: "A" },
        { code: "PSY 399", name: "Multicultural Psychology", credits: 3, grade: "B+" },
      ] },
      { id: "2", semester: "Winter", year: 2022, school: "URI", schoolName: "University of Rhode Island", color: "#1e40af", semesterGPA: 3.8, courses: [ { code: "MGT 345", name: "Business in Society", credits: 3, grade: "A-" } ] },
      { id: "3", semester: "Spring", year: 2022, school: "URI", schoolName: "University of Rhode Island", color: "#2563eb", semesterGPA: 3.7, courses: [
        { code: "MGT 341", name: "Organizational Behavior", credits: 3, grade: "A" },
        { code: "MKT 366", name: "Consumer Behavior", credits: 3, grade: "A-" },
        { code: "PSY 301", name: "Research Methods/Design in Behavioral Sciences", credits: 3, grade: "B+" },
      ] },
      { id: "4", semester: "Summer", year: 2022, school: "URI", schoolName: "University of Rhode Island", color: "#1d4ed8", semesterGPA: 4.0, courses: [ { code: "MKT 475", name: "Social Media Marketing", credits: 3, grade: "A+" } ] },
      { id: "5", semester: "Fall", year: 2022, school: "URI", schoolName: "University of Rhode Island", color: "#1e40af", semesterGPA: 3.85, courses: [
        { code: "CSV 302", name: "URI Community Service", credits: 1, grade: "A" },
        { code: "INE 315", name: "Legal Environment in Business", credits: 3, grade: "A-" },
        { code: "MKT 367", name: "Marketing Research", credits: 3, grade: "A" },
        { code: "MKT 390", name: "Junior Career Passport Program", credits: 1, grade: "A" },
        { code: "MKT 467", name: "Customer Analytics", credits: 3, grade: "A" },
        { code: "MKT 468", name: "Global Marketing", credits: 3, grade: "A-" },
        { code: "PSY 384", name: "Cognitive Psychology", credits: 3, grade: "B+" },
        { code: "PSY 432", name: "Advanced Developmental Psychology", credits: 3, grade: "A-" },
      ] },
      { id: "6", semester: "Spring", year: 2023, school: "URI", schoolName: "University of Rhode Island", color: "#3b82f6", semesterGPA: 3.75, courses: [
        { code: "BAI 310", name: "Business Data Analysis with Excel", credits: 3, grade: "A" },
        { code: "MGT 445", name: "Strategic Management", credits: 3, grade: "A-" },
        { code: "MKT 465", name: "Marketing Communications", credits: 3, grade: "A" },
        { code: "MKT 470", name: "Strategic Marketing Management", credits: 3, grade: "A-" },
        { code: "PSY 381", name: "Physiological Psychology", credits: 3, grade: "B+" },
        { code: "PSY 435", name: "Applied Psychological Research", credits: 3, grade: "A" },
        { code: "PSY 488", name: "Undergraduate Teaching Experience in Psychology", credits: 1, grade: "A" },
      ] },
    ],
  };

  const bentleyData: SchoolData = {
    name: "Bentley University",
    degree: "Master of Science in Data Analytics & Master of Business Administration",
    period: "2023 - 2025",
    stats: {
      gpa: 3.85,
      totalCredits: 36,
      completedCredits: 28,
      honors: ["Graduated on an accelerated 2-year program", "Dual master's degrees"],
    },
    awards: [ { title: "High Distinction", description: "Academic excellence recognition for graduate studies", date: "2024-2025" } ],
    semesters: [
      { id: "7", semester: "Fall", year: 2023, school: "Bentley", schoolName: "Bentley University", color: "#1e3a8a", semesterGPA: 3.75, courses: [
        { code: "CS 605", name: "Data Management and SQL for Analytics", credits: 3, grade: "A-" },
        { code: "FI 623", name: "Investments", credits: 3, grade: "A" },
        { code: "GR 603", name: "Leading Responsibly", credits: 3, grade: "A-" },
        { code: "IPM 652", name: "Managing with Analytics", credits: 3, grade: "A-" },
      ] },
      { id: "8", semester: "Spring", year: 2024, school: "Bentley", schoolName: "Bentley University", color: "#1e40af", semesterGPA: 3.9, courses: [
        { code: "GR 601", name: "Strategic Information Technology Alignment", credits: 3, grade: "A" },
        { code: "GR 602", name: "Business Process Management", credits: 3, grade: "A" },
        { code: "MA 610", name: "Optimization and Simulation for Business Decisions", credits: 3, grade: "A-" },
        { code: "ST 625", name: "Quantitative Analysis for Business", credits: 3, grade: "A" },
      ] },
      { id: "9", semester: "Summer", year: 2024, school: "Bentley", schoolName: "Bentley University", color: "#3b82f6", semesterGPA: 4.0, courses: [ { code: "GR 604", name: "Global Strategy", credits: 3, grade: "A+" }, { code: "GR 606", name: "Designing for the Value Chain", credits: 3, grade: "A" } ] },
      { id: "10", semester: "Fall", year: 2024, school: "Bentley", schoolName: "Bentley University", color: "#1e3a8a", semesterGPA: 3.85, courses: [
        { code: "CS 602", name: "Data-Driven Development with Python", credits: 3, grade: "A" },
        { code: "GR 645", name: "Law, Ethics and Social Responsibility", credits: 3, grade: "A-" },
        { code: "MA 611", name: "Time Series Analysis", credits: 3, grade: "A-" },
        { code: "ST 635", name: "Intermediate Statistical Modeling for Business", credits: 3, grade: "A" },
      ] },
      { id: "11", semester: "Spring", year: 2025, school: "Bentley", schoolName: "Bentley University", color: "#2563eb", semesterGPA: 3.9, courses: [
        { code: "CS 650", name: "Data Analytics Architecture with Big Data", credits: 3, grade: "A" },
        { code: "MA 705", name: "Data Science", credits: 3, grade: "A-" },
        { code: "MA 706", name: "Design of Experiments for Business", credits: 3, grade: "A" },
        { code: "MA 710", name: "Data Mining", credits: 3, grade: "A" },
      ] },
    ],
  };

  // ---------- Handlers ----------
  const handleSemesterClick = (semester: SemesterData) => {
    setSelectedSemester(semester);
    setIsModalOpen(true);
  };

  const handleViewAllClasses = (schoolData: SchoolData) => {
    setSelectedSchoolForAllClasses(schoolData);
    setIsAllClassesModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSemester(null);
  };

  const closeAllClassesModal = () => {
    setIsAllClassesModalOpen(false);
    setSelectedSchoolForAllClasses(null);
  };

  return (
    <section id="dna-timeline" className="py-20 bg-gradient-to-br from-slate-50 via-slate-100 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-800">🧬 Academic Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Timeline</span></h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">A concise overview of academic milestones, coursework, and honors across undergraduate and graduate studies.</p>
        </div>

        {/* School Sections */}
        <div className="space-y-12">
          <SchoolSection schoolData={bentleyData} onSemesterClick={handleSemesterClick} onViewAllClasses={handleViewAllClasses} />
          <SchoolSection schoolData={uriData} onSemesterClick={handleSemesterClick} onViewAllClasses={handleViewAllClasses} />
        </div>

        <DetailModal semester={selectedSemester} isOpen={isModalOpen} onClose={closeModal} />
        <AllClassesModal schoolData={selectedSchoolForAllClasses} isOpen={isAllClassesModalOpen} onClose={closeAllClassesModal} />
      </div>
    </section>
  );
};