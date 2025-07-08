import React from 'react';
import { X, Calendar, Clock, Tag, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const formatMarkdown = (text: string) => {
    // Simple markdown parsing for preview
    let formatted = text;
    
    // Headers
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-slate-900">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-slate-900">$1</h1>');
    
    // Bold and italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)\n```/g, 
      '<pre class="bg-slate-100 p-4 rounded-lg overflow-x-auto mt-4 mb-4"><code class="text-sm font-mono">$2</code></pre>');
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono">$1</code>');
    
    // Line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p class="mb-4">');
    formatted = formatted.replace(/\n/g, '<br>');
    
    return `<p class="mb-4">${formatted}</p>`;
  };

  const hasContent = (content: string) => content.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">Lab Note Preview</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title and Meta */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant={formData.published ? "default" : "secondary"}>
                {formData.published ? "Published" : "Draft"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {formData.category.replace('-', ' ')}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {formData.title || "Untitled Lab Note"}
            </h1>
            
            <p className="text-lg text-slate-600 mb-6">
              {formData.excerpt || "No excerpt provided"}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
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
                  <div className="flex flex-wrap gap-1">
                    {formatTags(formData.tags).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Analysis Section */}
            {hasContent(formData.content.analysis) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(formData.content.analysis) 
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Methodology Section */}
            {hasContent(formData.content.methodology) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Methodology</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(formData.content.methodology) 
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Code Section */}
            {hasContent(formData.content.code) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Code & Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(formData.content.code) 
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Insights Section */}
            {hasContent(formData.content.insights) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Strategic Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(formData.content.insights) 
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!hasContent(formData.content.analysis) && 
             !hasContent(formData.content.methodology) && 
             !hasContent(formData.content.code) && 
             !hasContent(formData.content.insights) && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-slate-500">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium mb-2">No content to preview</h3>
                    <p>Add some content to the analysis, methodology, code, or insights sections to see the preview.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  );
};

export default LabNotePreview;
