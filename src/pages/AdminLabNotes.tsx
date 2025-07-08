
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Tag, FlaskConical, BookOpen, Clock, ArrowRight, Filter, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LabNote {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  content?: {
    analysis?: string;
    methodology?: string;
    code?: string;
    insights?: string;
  };
}

const AdminLabNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Notes', count: 5 },
    { id: 'methodology', name: 'Methodology', count: 2 },
    { id: 'case-studies', name: 'Case Studies', count: 2 },
    { id: 'frameworks', name: 'Frameworks', count: 1 }
  ];

  const [notes, setNotes] = useState<LabNote[]>([
    {
      id: 1,
      title: "The Double-Diamond Approach to Problem Solving",
      excerpt: "How I adapted the design thinking methodology for complex business analysis. A systematic approach to divergent and convergent thinking in professional contexts.",
      category: "methodology",
      date: "2024-06-15",
      readTime: "8 min read",
      tags: ["problem-solving", "design-thinking", "analysis"]
    },
    {
      id: 2,
      title: "Case Study: Optimizing Multi-Channel Customer Journey",
      excerpt: "Breaking down a 6-month project that increased customer retention by 34%. Deep dive into data collection, hypothesis formation, and iterative testing.",
      category: "case-studies",
      date: "2024-06-08",
      readTime: "12 min read",
      tags: ["customer-experience", "data-analysis", "optimization"]
    },
    {
      id: 3,
      title: "Building a Personal Knowledge Management System",
      excerpt: "My evolution from scattered notes to a structured system for capturing, processing, and connecting professional insights. Tools, workflows, and mental models.",
      category: "frameworks",
      date: "2024-05-28",
      readTime: "6 min read",
      tags: ["knowledge-management", "productivity", "systems"]
    },
    {
      id: 4,
      title: "The Hypothesis-Driven Analysis Framework",
      excerpt: "Moving beyond descriptive analytics to predictive insights. How I structure investigations to maximize learning and minimize bias in professional contexts.",
      category: "methodology",
      date: "2024-05-20",
      readTime: "10 min read",
      tags: ["analytics", "hypothesis-testing", "decision-making"]
    },
    {
      id: 5,
      title: "Lessons from a Failed Project Initiative",
      excerpt: "What went wrong, what went right, and the systematic post-mortem process that turned failure into valuable professional DNA. Transparency in professional growth.",
      category: "case-studies",
      date: "2024-05-12",
      readTime: "9 min read",
      tags: ["failure-analysis", "learning", "project-management"]
    }
  ]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (noteId: number) => {
    navigate(`/admin/lab-notes/edit/${noteId}`);
  };

  const handleDelete = (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this lab note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
      toast({
        title: "Note deleted",
        description: "The lab note has been successfully deleted.",
      });
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/lab-notes/new');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <Button onClick={handleCreateNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Lab Note</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FlaskConical className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Lab Notes Management</h1>
              <p className="text-slate-600">Create, edit, and manage your analytical insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search lab notes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category.name} <span className="ml-1 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Notes Grid */}
        <div className="space-y-6">
          {filteredNotes.map(note => (
            <article
              key={note.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    {note.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {note.excerpt}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(note.id)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{note.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {note.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="text-xs text-slate-400">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No notes found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLabNotes;
