import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Tag, FlaskConical, BookOpen, Clock, ArrowRight, Filter, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type LabNote = Tables<'lab_notes'>;

const AdminLabNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Notes' },
    { id: 'methodology', name: 'Methodology' },
    { id: 'case-studies', name: 'Case Studies' },
    { id: 'frameworks', name: 'Frameworks' }
  ];

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lab notes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return notes.length;
    return notes.filter(note => note.category === categoryId).length;
  };

  const handleEdit = (noteId: string) => {
    navigate(`/admin/lab-notes/${noteId}`);
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this lab note?')) {
      try {
        const { error } = await supabase
          .from('lab_notes')
          .delete()
          .eq('id', noteId);

        if (error) throw error;

        setNotes(notes.filter(note => note.id !== noteId));
        toast({
          title: "Note deleted",
          description: "The lab note has been successfully deleted.",
        });
      } catch (error) {
        console.error('Error deleting note:', error);
        toast({
          title: "Error",
          description: "Failed to delete the lab note.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/lab-notes/new');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FlaskConical className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading lab notes...</p>
        </div>
      </div>
    );
  }

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
                  {category.name} ({getCategoryCount(category.id)})
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
              {category.name} <span className="ml-1 text-xs opacity-75">({getCategoryCount(category.id)})</span>
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
                    <span>{note.read_time}</span>
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
        {filteredNotes.length === 0 && !loading && (
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
