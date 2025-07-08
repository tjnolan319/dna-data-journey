import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import LabNotePreview from "@/components/LabNotePreview";

type LabNote = Tables<'lab_notes'>;

interface LabNoteFormData {
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

const AdminLabNoteEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState<LabNoteFormData>({
    title: '',
    excerpt: '',
    category: 'methodology',
    tags: '',
    read_time: '',
    date: new Date().toISOString().split('T')[0],
    published: false,
    content: {
      analysis: '',
      methodology: '',
      code: '',
      insights: ''
    }
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchNote(id);
    } else {
      // Reset loading state for new notes
      setInitialLoading(false);
    }
  }, [id, isEditing]);

  const fetchNote = async (noteId: string) => {
    try {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('lab_notes')
        .select('*')
        .eq('id', noteId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          category: data.category || 'methodology',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          read_time: data.read_time || '',
          date: data.date || new Date().toISOString().split('T')[0],
          published: Boolean(data.published),
          content: typeof data.content === 'object' && data.content ? {
            analysis: (data.content as any).analysis || '',
            methodology: (data.content as any).methodology || '',
            code: (data.content as any).code || '',
            insights: (data.content as any).insights || ''
          } : {
            analysis: '',
            methodology: '',
            code: '',
            insights: ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      toast({
        title: "Error",
        description: "Failed to load the lab note. Please try again.",
        variant: "destructive",
      });
      // Navigate back to lab notes list on error
      navigate('/admin/lab-notes');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('content.')) {
      const contentField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [contentField]: value as string
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in the title and excerpt fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const noteData = {
        title: formData.title,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: tagsArray,
        read_time: formData.read_time,
        date: formData.date,
        published: formData.published,
        content: formData.content
      };

      console.log('Saving note data:', noteData);
      console.log('Is editing:', isEditing);
      console.log('Note ID:', id);

      if (isEditing && id) {
        const { data, error } = await supabase
          .from('lab_notes')
          .update(noteData as TablesUpdate<'lab_notes'>)
          .eq('id', id)
          .select()
          .single();

        console.log('Update response:', { data, error });

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        if (data) {
          toast({
            title: "Note updated",
            description: "Lab note has been successfully updated.",
          });
        }
      } else {
        const { data, error } = await supabase
          .from('lab_notes')
          .insert([noteData as TablesInsert<'lab_notes'>])
          .select()
          .single();

        console.log('Insert response:', { data, error });

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        if (data) {
          toast({
            title: "Note created",
            description: "Lab note has been successfully created.",
          });
        }
      }

      navigate('/admin/lab-notes');
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} the lab note. ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lab note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/lab-notes')}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lab Notes</span>
            </button>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handlePreview} className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')} Note</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isEditing ? 'Edit Lab Note' : 'Create New Lab Note'}
          </h1>
          <p className="text-slate-600">
            {isEditing ? 'Update your analytical insights and methodologies' : 'Document your analytical insights and methodologies'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter the lab note title"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description of the lab note content"
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="methodology">Methodology</option>
                      <option value="case-studies">Case Studies</option>
                      <option value="frameworks">Frameworks</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="readTime">Read Time</Label>
                    <Input
                      id="readTime"
                      value={formData.read_time}
                      onChange={(e) => handleInputChange('read_time', e.target.value)}
                      placeholder="e.g., 8 min read"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="published"
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => handleInputChange('published', e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="comma, separated, tags"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="analysis">Analysis Section</Label>
                <textarea
                  id="analysis"
                  value={formData.content.analysis}
                  onChange={(e) => handleInputChange('content.analysis', e.target.value)}
                  placeholder="Write your analysis content here. You can use Markdown formatting."
                  className="w-full min-h-[400px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Tip: You can use Markdown formatting for headings, lists, and emphasis.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methodology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Methodology Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="methodology">Methodology Section</Label>
                <textarea
                  id="methodology"
                  value={formData.content.methodology}
                  onChange={(e) => handleInputChange('content.methodology', e.target.value)}
                  placeholder="Document your methodology and approach here."
                  className="w-full min-h-[400px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code & Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="code">Code Section</Label>
                <textarea
                  id="code"
                  value={formData.content.code}
                  onChange={(e) => handleInputChange('content.code', e.target.value)}
                  placeholder="Add code examples, SQL queries, or technical implementation details."
                  className="w-full min-h-[400px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-mono text-sm bg-slate-50"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Use code blocks with ```language for syntax highlighting.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="insights">Insights Section</Label>
                <textarea
                  id="insights"
                  value={formData.content.insights}
                  onChange={(e) => handleInputChange('content.insights', e.target.value)}
                  placeholder="Share your strategic insights, recommendations, and key takeaways."
                  className="w-full min-h-[400px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal */}
      <LabNotePreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        formData={formData}
      />
    </div>
  );
};

export default AdminLabNoteEditor;
