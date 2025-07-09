import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Tag, FlaskConical, BookOpen, Clock, ArrowRight, Filter, Plus, Edit, Trash2, ArrowLeft, Eye, CheckCircle, XCircle, User, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import LabNotePreview from "@/components/LabNotePreview";

type LabNote = Tables<'lab_notes'>;

// Define the expected format for the preview component
interface PreviewFormData {
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  read_time: string;
  date: string;
  published: boolean;
  content: {
    analysis: string;
    methodology: string;
    code: string;
    insights: string;
  };
}

const AdminLabNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<PreviewFormData | null>(null);

  const categories = [
    { id: 'all', name: 'All Notes' },
    { id: 'methodology', name: 'Methodology' },
    { id: 'case-studies', name: 'Case Studies' },
    { id: 'frameworks', name: 'Frameworks' },
    { id: 'current-events', name: 'Current Events' },
    { id: 'industry-insights', name: 'Industry Insights' },
    { id: 'technical-deep-dive', name: 'Technical Deep Dive' },
    { id: 'best-practices', name: 'Best Practices' }
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

  const handleDuplicate = async (note: LabNote) => {
    try {
      const duplicateData = {
        title: `${note.title} (Copy)`,
        excerpt: note.excerpt,
        category: note.category,
        tags: note.tags,
        read_time: note.read_time,
        date: new Date().toISOString().split('T')[0],
        published: false, // Always create duplicates as drafts
        content: note.content,
        tab_config: note.tab_config,
        admin_comments: note.admin_comments ? `${note.admin_comments}\n\n--- Duplicated from original note ---` : 'Duplicated from original note'
      };

      const { data, error } = await supabase
        .from('lab_notes')
        .insert([duplicateData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setNotes(prev => [data, ...prev]);
        toast({
          title: "Note duplicated",
          description: "The lab note has been successfully duplicated as a draft.",
        });
      }
    } catch (error) {
      console.error('Error duplicating note:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate the lab note.",
        variant: "destructive",
      });
    }
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

  const handlePreview = (note: LabNote) => {
    // Convert the note to the expected format for the preview component
    const formData: PreviewFormData = {
      title: note.title || '',
      excerpt: note.excerpt || '',
      category: note.category || 'methodology',
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : '',
      read_time: note.read_time || '',
      date: note.date || new Date().toISOString().split('T')[0],
      published: Boolean(note.published),
      content: typeof note.content === 'object' && note.content ? {
        analysis: (note.content as any).analysis || '',
        methodology: (note.content as any).methodology || '',
        code: (note.content as any).code || '',
        insights: (note.content as any).insights || ''
      } : {
        analysis: '',
        methodology: '',
        code: '',
        insights: ''
      }
    };
    
    setPreviewNote(formData);
    setPreviewOpen(true);
  };

  const togglePublished = async (noteId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lab_notes')
        .update({ published: !currentStatus })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, published: !currentStatus } : note
      ));

      toast({
        title: "Status updated",
        description: `Lab note ${!currentStatus ? 'published' : 'unpublished'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating published status:', error);
      toast({
        title: "Error",
        description: "Failed to update published status.",
        variant: "destructive",
      });
    }
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
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {note.title}
                    </h2>
                    <div className="flex items-center space-x-3 p-2 border border-slate-200 rounded-lg">
                      <span className={`text-sm font-medium ${note.published ? 'text-green-700' : 'text-red-600'}`}>
                        {note.published ? 'Published' : 'Draft'}
                      </span>
                      {note.published ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <Switch
                        checked={note.published}
                        onCheckedChange={() => togglePublished(note.id, note.published)}
                        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-200"
                      />
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {note.excerpt}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 font-medium">Authored by Tim Nolan</span>
                  </div>
                  {note.admin_comments && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="text-xs text-yellow-700 font-medium mb-1">Admin Notes:</div>
                      <div className="text-sm text-yellow-800">{note.admin_comments}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(note)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(note)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </Button>
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

      {/* Preview Modal */}
      {previewNote && (
        <LabNotePreview
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          formData={previewNote}
        />
      )}
    </div>
  );
};

export default AdminLabNotes;
