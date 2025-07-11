import React, { useState, useEffect } from 'react';
import { Search, Calendar, Tag, FlaskConical, BookOpen, Clock, Filter, User, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { LabNotePreview } from "@/components/LabNotePreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


type LabNote = Tables<'lab_notes'>;

interface TabConfig {
  id: string;
  name: string;
  icon: string;
  order: number;
}

// Type guard for TabConfig array
const isTabConfigArray = (value: any): value is TabConfig[] => {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' && 
    typeof item.id === 'string' && 
    typeof item.name === 'string' && 
    typeof item.icon === 'string' && 
    typeof item.order === 'number'
  );
};

const PublicLabNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<any>(null);
  const navigate = useNavigate();


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
        .eq('published', true) // Only fetch published notes
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
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

  const handlePreview = (note: LabNote) => {
    // Convert the note to the expected format for the preview component
    const tabConfig = isTabConfigArray(note.tab_config) ? note.tab_config : [
      { id: 'analysis', name: 'Analysis', icon: 'microscope', order: 0 },
      { id: 'methodology', name: 'Methodology', icon: 'settings', order: 1 },
      { id: 'code', name: 'Code', icon: 'code', order: 2 },
      { id: 'insights', name: 'Insights', icon: 'lightbulb', order: 3 },
      { id: 'considerations', name: 'Considerations', icon: 'brain', order: 4 }
    ];

    // Safely handle content
    let content: Record<string, string> = {};
    if (typeof note.content === 'object' && note.content) {
      try {
        if (note.content && typeof note.content === 'object') {
          Object.entries(note.content).forEach(([key, value]) => {
            content[key] = typeof value === 'string' ? value : String(value || '');
          });
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        content = {};
      }
    }

    const formData = {
      title: note.title || '',
      excerpt: note.excerpt || '',
      category: note.category || 'methodology',
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : '',
      read_time: note.read_time || '',
      date: note.date || new Date().toISOString().split('T')[0],
      published: Boolean(note.published),
      content,
      tab_config: tabConfig
    };
    
    setPreviewNote(formData);
    setPreviewOpen(true);
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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Button
            onClick={() => navigate('/')}  // adjust path if needed
            variant="ghost"
            className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Button>
      
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FlaskConical className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Lab Notes</h1>
              <p className="text-slate-600 text-lg">Analytical insights and methodological explorations</p>
            </div>
          </div>
      
          <div className="text-slate-600">
            <p className="mb-2">
              Welcome to my laboratory of ideas, where analytical rigor meets creative exploration. 
              Each note represents a deep dive into methodologies, frameworks, and insights that shape 
              modern business analysis.
            </p>
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
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => handlePreview(note)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {note.excerpt}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 font-medium">Tim Nolan</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-blue-600 font-medium">Read More</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
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
                  {note.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-slate-400">
                      +{note.tags.length - 3}
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

export default PublicLabNotes;
