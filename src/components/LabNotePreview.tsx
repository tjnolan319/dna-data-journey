import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, Eye, TrendingUp, Target, Code, Lightbulb, CheckCircle2, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

  if (!isOpen) return null;

  // Sample data for visualizations (you can replace this with real data)
  const sampleData = [
    { month: 'Jan', value: 65, baseline: 60 },
    { month: 'Feb', value: 68, baseline: 62 },
    { month: 'Mar', value: 72, baseline: 61 },
    { month: 'Apr', value: 75, baseline: 63 },
    { month: 'May', value: 78, baseline: 65 },
    { month: 'Jun', value: 82, baseline: 67 }
  ];

  const channelData = [
    { channel: 'Email', impact: 25, cost: 10 },
    { channel: 'Social', impact: 18, cost: 22 },
    { channel: 'Direct', impact: 32, cost: 8 },
    { channel: 'Referral', impact: 28, cost: 12 }
  ];

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
    if (!text) return '';
    
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
      '<div class="bg-slate-900 rounded-lg p-4 overflow-x-auto mt-4 mb-4"><pre class="text-sm text-slate-300"><code>$2</code></pre></div>');
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">$1</code>');
    
    // Line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p class="mb-4 text-slate-700 leading-relaxed">');
    formatted = formatted.replace(/\n/g, '<br>');
    
    return `<p class="mb-4 text-slate-700 leading-relaxed">${formatted}</p>`;
  };

  const hasContent = (content: string) => content && content.trim().length > 0;

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: TrendingUp },
    { id: 'methodology', label: 'Methodology', icon: Target },
    { id: 'code', label: 'Implementation', icon: Code },
    { id: 'insights', label: 'Strategic Insights', icon: Lightbulb }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-50 rounded-lg max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Lab Note Preview</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Entry Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant={formData.published ? "default" : "secondary"}>
                    {formData.published ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {formData.category.replace('-', ' ')}
                  </Badge>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                  {formData.title || "Untitled Lab Note"}
                </h1>
                
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {formData.excerpt || "No excerpt provided"}
                </p>

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
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-200">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => {
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
                {/* Analysis Tab */}
                {activeTab === 'analysis' && (
                  <div className="space-y-8">
                    {hasContent(formData.content.analysis) ? (
                      <>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <span>Analysis Overview</span>
                          </h2>
                          <div 
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(formData.content.analysis) 
                            }}
                          />
                        </div>

                        {/* Sample Visualization */}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h3>
                          <div className="bg-slate-50 rounded-lg p-4 mb-4">
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={sampleData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="baseline" 
                                  stroke="#94a3b8" 
                                  strokeWidth={2}
                                  name="Baseline"
                                  strokeDasharray="5 5"
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#3b82f6" 
                                  strokeWidth={3}
                                  name="Optimized"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-500 mb-2">No Analysis Content</h3>
                        <p className="text-slate-400">Add analysis content to see it here</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Methodology Tab */}
                {activeTab === 'methodology' && (
                  <div className="space-y-6">
                    {hasContent(formData.content.methodology) ? (
                      <>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            <span>Methodology</span>
                          </h2>
                          <div 
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(formData.content.methodology) 
                            }}
                          />
                        </div>

                        {/* Sample Framework */}
                        <div className="bg-slate-50 rounded-lg p-6">
                          <h4 className="font-semibold text-slate-900 mb-4">Strategic Framework</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4">
                              <h5 className="font-medium text-slate-900 mb-2 flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Discovery Phase</span>
                              </h5>
                              <p className="text-sm text-slate-600">Data collection and initial analysis</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                              <h5 className="font-medium text-slate-900 mb-2 flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Implementation</span>
                              </h5>
                              <p className="text-sm text-slate-600">Strategic execution and monitoring</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Target className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-500 mb-2">No Methodology Content</h3>
                        <p className="text-slate-400">Add methodology content to see it here</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Code Tab */}
                {activeTab === 'code' && (
                  <div className="space-y-6">
                    {hasContent(formData.content.code) ? (
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                          <Code className="w-5 h-5 text-blue-600" />
                          <span>Implementation</span>
                        </h2>
                        <div 
                          className="prose prose-slate max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: formatMarkdown(formData.content.code) 
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Code className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-500 mb-2">No Implementation Content</h3>
                        <p className="text-slate-400">Add code and implementation details to see them here</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    {hasContent(formData.content.insights) ? (
                      <>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                            <Lightbulb className="w-5 h-5 text-blue-600" />
                            <span>Strategic Insights</span>
                          </h2>
                          <div 
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(formData.content.insights) 
                            }}
                          />
                        </div>

                        {/* Sample Insights Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h4 className="font-semibold text-green-900 mb-3">🎯 Key Findings</h4>
                            <ul className="space-y-2 text-green-800 text-sm">
                              <li>• Identified high-impact optimization opportunities</li>
                              <li>• Validated core hypotheses with statistical significance</li>
                              <li>• Discovered unexpected behavioral patterns</li>
                            </ul>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-900 mb-3">💡 Strategic Recommendations</h4>
                            <ul className="space-y-2 text-blue-800 text-sm">
                              <li>• Implement systematic testing framework</li>
                              <li>• Focus resources on highest-impact channels</li>
                              <li>• Establish continuous improvement process</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Lightbulb className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-500 mb-2">No Strategic Insights</h3>
                        <p className="text-slate-400">Add strategic insights and recommendations to see them here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-4 flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  );
};

export default LabNotePreview;
