import React, { useState, useEffect } from "react";
import {
  X,
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  Trophy,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ---------- Types ----------
interface Course {
  id: string;
  code: string;
  name: string;
  credits?: number;
  description?: string;
  tools?: string[];
}

interface AwardItem {
  id: string;
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
  school_id: string;
  schoolName: string;
  courses: Course[];
}

interface SchoolData {
  id: string;
  name: string;
  degree: string;
  period: string;
  stats: AcademicStats;
  awards: AwardItem[];
  semesters: SemesterData[];
}

// ---------- Helpers ----------
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

// ---------- Course Detail Modal ----------
const CourseDetailModal = ({
  course,
  isOpen,
  onClose,
}: {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
        <div className="border-b px-6 py-4 flex items-start justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-slate-800">{course.code}</h3>
            <p className="text-lg text-slate-600 mt-1">{course.name}</p>
            {course.credits && (
              <p className="text-sm text-slate-500 mt-2">Credits: {course.credits}</p>
            )}
          </div>

          {course.description && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Description
              </h4>
              <p className="text-slate-600">{course.description}</p>
            </div>
          )}

          {course.tools && course.tools.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tools & Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- All Classes Modal ----------
const AllClassesModal = ({
  schoolData,
  isOpen,
  onClose,
  onCourseClick,
}: {
  schoolData: SchoolData | null;
  isOpen: boolean;
  onClose: () => void;
  onCourseClick: (course: Course) => void;
}) => {
  if (!isOpen || !schoolData) return null;

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

          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-8">
            {schoolData.semesters.map((semester) => (
              <div key={semester.id} className="border rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-slate-800">{semester.semester} {semester.year}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 mt-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">{semester.courses.length} courses</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {semester.courses.map((course) => (
                      <div 
                        key={course.id} 
                        className="bg-white p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                        onClick={() => onCourseClick(course)}
                      >
                        <div className="font-semibold text-slate-800 mb-2">{course.code}</div>
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

// ---------- School Section ----------
const SchoolSection = ({
  schoolData,
  onViewAllClasses,
}: {
  schoolData: SchoolData;
  onViewAllClasses: (schoolData: SchoolData) => void;
}) => {
  const colors = getSchoolColors(schoolData.name);
  const totalCourses = schoolData.semesters.reduce((t, s) => t + s.courses.length, 0);
  
  // Check if this is URI to add the asterisk note
  const isURI = schoolData.name.toLowerCase().includes("rhode island");

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
              {schoolData.awards.map((award) => (
                <div key={award.id} className="border rounded-lg p-4 hover:shadow transition-shadow bg-white">
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
                <div className="text-sm text-slate-600">
                  {totalCourses} courses across {schoolData.semesters.length} semesters
                  {isURI && <span className="text-xs text-slate-500 ml-1">*at level 200 or above</span>}
                </div>
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
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedSchoolForAllClasses, setSelectedSchoolForAllClasses] = useState<SchoolData | null>(null);
  const [isAllClassesModalOpen, setIsAllClassesModalOpen] = useState(false);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      // Fetch schools with their related data
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select(`
          *,
          awards (*),
          semesters (
            *,
            courses (*)
          )
        `)
        .order('display_order');

      if (schoolsError) throw schoolsError;

      const formattedSchools: SchoolData[] = schoolsData.map(school => ({
        id: school.id,
        name: school.name,
        degree: school.degree,
        period: school.period,
        stats: {
          gpa: school.gpa,
          totalCredits: school.total_credits,
          completedCredits: school.completed_credits,
          honors: school.honors,
        },
        awards: school.awards,
        semesters: school.semesters
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((semester: any) => ({
            id: semester.id,
            semester: semester.semester,
            year: semester.year,
            school_id: semester.school_id,
            schoolName: school.name,
            courses: semester.courses,
          })),
      }));

      setSchools(formattedSchools);
    } catch (error) {
      console.error('Error fetching academic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleViewAllClasses = (schoolData: SchoolData) => {
    setSelectedSchoolForAllClasses(schoolData);
    setIsAllClassesModalOpen(true);
  };

  const closeCourseModal = () => {
    setIsCourseModalOpen(false);
    setSelectedCourse(null);
  };

  const closeAllClassesModal = () => {
    setIsAllClassesModalOpen(false);
    setSelectedSchoolForAllClasses(null);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-slate-100 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-lg text-slate-600">Loading academic timeline...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="dna-timeline" className="py-20 bg-gradient-to-br from-slate-50 via-slate-100 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-800">
            🧬 Academic Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Timeline</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            A concise overview of academic milestones, coursework, and honors across undergraduate and graduate studies.
          </p>
        </div>

        {/* School Sections */}
        <div className="space-y-12">
          {schools.map((school) => (
            <SchoolSection 
              key={school.id} 
              schoolData={school} 
              onViewAllClasses={handleViewAllClasses} 
            />
          ))}
        </div>

        <CourseDetailModal 
          course={selectedCourse} 
          isOpen={isCourseModalOpen} 
          onClose={closeCourseModal} 
        />
        
        <AllClassesModal 
          schoolData={selectedSchoolForAllClasses} 
          isOpen={isAllClassesModalOpen} 
          onClose={closeAllClassesModal}
          onCourseClick={handleCourseClick}
        />
      </div>
    </section>
  );
};
