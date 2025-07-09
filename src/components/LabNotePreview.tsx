
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Eye, Share2, BookOpen, TrendingUp, BarChart3, Code, Lightbulb, Target, CheckCircle2, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type LabNote = Tables<'lab_notes'>;

interface LabNotePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
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
  };
}

const LabNotePreview: React.FC<LabNotePreviewProps> = ({ isOpen, onClose, formData }) => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [relatedNotes, setRelatedNotes] = useState<LabNote[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchRelatedNotes();
    }
  }, [isOpen, formData.title]);

  const fetchRelatedNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_notes')
        .select('*')
        .neq('title', formData.title) // Exclude current note
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      setRelatedNotes(data || []);
    } catch (error) {
      console.error('Error fetching related notes:', error);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTags = (tagsString: string) => {
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const getBoxClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'blue': 'bg-blue-50 border-blue-200 text-blue-800',
      'green': 'bg-green-50 border-green-200 text-green-800',
      'yellow': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'red': 'bg-red-50 border-red-200 text-red-800',
      'purple': 'bg-purple-50 border-purple-200 text-purple-800',
      'orange': 'bg-orange-50 border-orange-200 text-orange-800',
      'gray': 'bg-gray-50 border-gray-200 text-gray-800',
      'indigo': 'bg-indigo-50 border-indigo-200 text-indigo-800',
      'pink': 'bg-pink-50 border-pink-200 text-pink-800',
      'teal': 'bg-teal-50 border-teal-200 text-teal-800',
    };
    
    return colorMap[color.toLowerCase()] || colorMap['gray'];
  };

  const formatMarkdown = (text: string) => {
    if (!text) return '';
    
    let formatted = text;
    
    // Custom colored boxes - Process before other formatting
    formatted = formatted.replace(/~box\(([^)]+)\)\s*([\s\S]*?)\s*~endbox/g, (match, color, content) => {
      const boxClasses = getBoxClasses(color);
      return `<div class="border-l-4 ${boxClasses} p-4 my-4 rounded-r-lg border">${content.trim()}</div>`;
    });
    
    // Headers
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-slate-900">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-slate-900">$1</h1>');
    
    // Bold and italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Code blocks with syntax highlighting indication
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)\n```/g, 
      '<div class="bg-slate-900 rounded-lg p-4 overflow-x-auto my-4"><pre class="text-sm text-slate-300"><code>$2</code></pre></div>');
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">$1</code>');
    
    // Lists
    formatted = formatted.replace(/^\* (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>');
    formatted = formatted.replace(/^\- (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>');
    
    // Links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
    
    // Paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p class="mb-4 text-slate-700 leading-relaxed">');
    formatted = formatted.replace(/\n/g, '<br>');
    
    return `<div class="prose prose-slate max-w-none"><p class="mb-4 text-slate-700 leading-relaxed">${formatted}</p></div>`;
  };

  const hasContent = (content: string) => content && content.trim().length > 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'methodology':
        return 'bg-blue-100 text-blue-700';
      case 'case-studies':
        return 'bg-green-100 text-green-700';
      case 'frameworks':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: TrendingUp, content: formData.content.analysis },
    { id: 'methodology', label: 'Methodology', icon: Target, content: formData.content.methodology },
    { id: 'code', label: 'Implementation', icon: Code, content: formData.content.code },
    { id: 'insights', label: 'Strategic Insights', icon: Lightbulb, content: formData.content.insights }
  ];

  const availableTabs = tabs.filter(tab => hasContent(tab.content));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Lab Note Preview</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <BookOpen className="w-5 h-5" />
              </button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Entry Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant={formData.published ? "default" : "secondary"}>
                    {formData.published ? "Published" : "Draft"}
                  </Badge>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getCategoryColor(formData.category)}`}>
                    {formData.category.replace('-', ' ')}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                  {formData.title || "Untitled Lab Note"}
                </h1>
                
                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                  {formData.excerpt || "No excerpt provided"}
                </p>

                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-slate-500" />
                  <span className="text-base text-slate-700 font-medium">Authored by Tim Nolan</span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(formData.date)}</span>
                  </div>
                  {formData.read_time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formData.read_time}</span>
                    </div>
                  )}
                  {formData.tags && (
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>{formatTags(formData.tags).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            {availableTabs.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-200">
                  <div className="flex overflow-x-auto">
                    {availableTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.id
                              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-8">
                  {availableTabs.map((tab) => {
                    if (activeTab !== tab.id) return null;
                    
                    const Icon = tab.icon;
                    return (
                      <div key={tab.id} className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <span>{tab.label}</span>
                          </h2>
                          
                          <div 
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(tab.content) 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl border border-slate-200 p-12">
                <div className="text-center text-slate-500">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-medium mb-2">No content to preview</h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Add some content to the analysis, methodology, code, or insights sections to see the preview with tabbed navigation.
                  </p>
                </div>
              </div>
            )}

            {/* Related Notes */}
            {availableTabs.length > 0 && relatedNotes.length > 0 && (
              <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Lab Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedNotes.map((note) => (
                    <div key={note.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-slate-900 mb-1">{note.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{note.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 capitalize">
                          {note.category.replace('-', ' ')} • {note.read_time}
                        </span>
                        <span className="text-xs text-slate-500">
                          by Tim Nolan
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabNotePreview;
