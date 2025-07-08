
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface LabNoteData {
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  readTime: string;
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
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState<LabNoteData>({
    title: '',
    excerpt: '',
    category: 'methodology',
    tags: '',
    readTime: '',
    content: {
      analysis: '',
      methodology: '',
      code: '',
      insights: ''
    }
  });

  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (isEditing) {
      // In a real app, you'd fetch the note data from your backend
      // For now, we'll simulate loading existing data
      setFormData({
        title: "Sample Lab Note Title",
        excerpt: "This is a sample excerpt for demonstration purposes.",
        category: "case-studies",
        tags: "analysis, methodology, case-study",
        readTime: "8 min read",
        content: {
          analysis: "## Analysis Content\n\nYour analysis content goes here...",
          methodology: "## Methodology Content\n\nYour methodology content goes here...",
          code: "```python\n# Your code examples go here\nprint('Hello, Lab Notes!')\n```",
          insights: "## Strategic Insights\n\nYour insights content goes here..."
        }
      });
    }
  }, [id, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('content.')) {
      const contentField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [contentField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in the title and excerpt fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you'd save to your backend here
    toast({
      title: isEditing ? "Note updated" : "Note created",
      description: `Lab note has been successfully ${isEditing ? 'updated' : 'created'}.`,
    });

    navigate('/admin/lab-notes');
  };

  const handlePreview = () => {
    // In a real app, you'd navigate to a preview page
    toast({
      title: "Preview feature",
      description: "Preview functionality will be implemented in the next iteration.",
    });
  };

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
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update' : 'Create'} Note</span>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      value={formData.readTime}
                      onChange={(e) => handleInputChange('readTime', e.target.value)}
                      placeholder="e.g., 8 min read"
                    />
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
    </div>
  );
};

export default AdminLabNoteEditor;
