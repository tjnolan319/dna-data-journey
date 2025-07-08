import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen, TrendingUp, BarChart3, Code, Lightbulb, Target, CheckCircle2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
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

  // Sample data for visualizations
  const customerRetentionData = [
    { month: 'Jan', baseline: 68, optimized: 68 },
    { month: 'Feb', baseline: 65, optimized: 70 },
    { month: 'Mar', baseline: 63, optimized: 75 },
    { month: 'Apr', baseline: 61, optimized: 78 },
    { month: 'May', baseline: 64, optimized: 82 },
    { month: 'Jun', baseline: 66, optimized: 85 }
  ];

  const channelPerformance = [
    { channel: 'Email', impact: 23, cost: 12 },
    { channel: 'Social', impact: 18, cost: 25 },
    { channel: 'Direct', impact: 31, cost: 8 },
    { channel: 'Referral', impact: 28, cost: 15 }
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
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-slate-900 mb-4">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-slate-900 mb-4">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-slate-900 mb-4">$1</h1>');
    
    // Bold and italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)\n```/g, 
      '<div class="bg-slate-900 rounded-lg p-4 overflow-x-auto my-4"><pre class="text-sm text-slate-300"><code>$2</code></pre></div>');
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">$1</code>');
    
    // Line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p class="text-slate-700 leading-relaxed mb-4">');
    formatted = formatted.replace(/\n/g, '<br>');
    
    return `<p class="text-slate-700 leading-relaxed mb-4">${formatted}</p>`;
  };

  const hasContent = (content: string) => content && content.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-hidden">
      {/* Header Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Lab Notes</span>
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <BookOpen className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Entry Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  formData.published 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {formData.published ? 'Published' : 'Draft'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full capitalize">
                  {formData.category.replace('-', ' ')}
                </span>
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
              <div className="flex">
                {[
                  { id: 'analysis', label: 'Analysis', icon: TrendingUp },
                  { id: 'methodology', label: 'Methodology', icon: Target },
                  { id: 'code', label: 'Implementation', icon: Code },
                  { id: 'insights', label: 'Strategic Insights', icon: Lightbulb }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
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
                          <span>Problem Definition & Analysis</span>
                        </h2>
                        <div 
                          className="prose prose-slate max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: formatMarkdown(formData.content.analysis) 
                          }}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h3>
                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={customerRetentionData}>
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
                                dataKey="optimized" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                name="Post-Optimization"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-slate-600">
                          Performance metrics showing improvement over the analysis period with clear trend indicators.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Impact vs Cost Analysis</h3>
                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={channelPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="channel" stroke="#64748b" />
                              <YAxis stroke="#64748b" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '8px'
                                }}
                              />
                              <Bar dataKey="impact" fill="#3b82f6" name="Impact Score" />
                              <Bar dataKey="cost" fill="#10b981" name="Cost Index" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-slate-600">
                          Comparative analysis of different channels showing impact scores versus cost indices.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span>Problem Definition & Analysis</span>
                      </h2>
                      <div className="bg-slate-50 rounded-lg p-6">
                        <p className="text-slate-700 leading-relaxed mb-4">
                          <strong>Challenge:</strong> No analysis content has been provided yet.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                          <strong>Next Steps:</strong> Add your analysis content to see detailed insights and visualizations here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Methodology Tab */}
              {activeTab === 'methodology' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span>Strategic Framework</span>
                    </h2>
                    
                    {hasContent(formData.content.methodology) ? (
                      <div 
                        className="prose prose-slate max-w-none mb-6"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(formData.content.methodology) 
                        }}
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-6 mb-6">
                        <p className="text-slate-700 leading-relaxed">
                          Add your methodology content to see the strategic framework and implementation steps here.
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-900 mb-3">1. Discovery & Mapping</h4>
                        <ul className="space-y-2 text-slate-700 text-sm">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Data collection and initial analysis</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Stakeholder interviews and requirements</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Pain point identification</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-900 mb-3">2. Hypothesis Formation</h4>
                        <ul className="space-y-2 text-slate-700 text-sm">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Model development and testing</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Prioritization matrix creation</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Success metrics definition</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-900 mb-3">3. Testing & Validation</h4>
                        <ul className="space-y-2 text-slate-700 text-sm">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Framework implementation</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Statistical significance monitoring</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Iterative optimization cycles</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-900 mb-3">4. Implementation & Scale</h4>
                        <ul className="space-y-2 text-slate-700 text-sm">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Rollout strategy development</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Performance monitoring dashboard</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Continuous improvement framework</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Methodological Insight</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      The most critical factor was establishing proper control groups and ensuring statistical rigor 
                      throughout the testing process. This systematic approach prevents false positives and ensures scalable results.
                    </p>
                  </div>
                </div>
              )}

              {/* Code Tab */}
              {activeTab === 'code' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      <span>Technical Implementation</span>
                    </h2>
                    
                    {hasContent(formData.content.code) ? (
                      <div 
                        className="prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(formData.content.code) 
                        }}
                      />
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Sample Implementation</h4>
                          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm text-slate-300">
{`# Sample analysis framework
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

def analyze_performance_metrics(df):
    """
    Perform comprehensive analysis of key performance indicators
    """
    # Calculate key metrics
    metrics = df.groupby('category').agg({
        'value': ['mean', 'std', 'count'],
        'impact': 'sum'
    }).round(2)
    
    return metrics

# Implementation example
results = analyze_performance_metrics(data)
print(f"Analysis complete: {len(results)} metrics calculated")`}
                            </pre>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h5 className="font-semibold text-yellow-900 mb-2">Implementation Note</h5>
                          <p className="text-yellow-800 text-sm">
                            Add your code and implementation details to see the technical approach and methodology here.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Strategic Insights Tab */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <span>Strategic Insights & Recommendations</span>
                    </h2>
                    
                    {hasContent(formData.content.insights) ? (
                      <div 
                        className="prose prose-slate max-w-none mb-6"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(formData.content.insights) 
                        }}
                      />
                    ) : null}
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                          <h4 className="font-semibold text-green-900 mb-3">🎯 High-Impact Findings</h4>
                          <ul className="space-y-2 text-green-800 text-sm">
                            <li>• Identified key optimization opportunities</li>
                            <li>• Validated core hypotheses with data</li>
                            <li>• Discovered unexpected patterns</li>
                            <li>• Quantified impact across channels</li>
                          </ul>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <h4 className="font-semibold text-red-900 mb-3">⚠️ Critical Challenges</h4>
                          <ul className="space-y-2 text-red-800 text-sm">
                            <li>• Attribution complexity across touchpoints</li>
                            <li>• Data quality and consistency issues</li>
                            <li>• Seasonal variation effects</li>
                            <li>• Resource allocation constraints</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Strategic Recommendations</h4>
                        <div className="space-y-4">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium text-slate-900 mb-1">1. Optimize Resource Allocation</h5>
                            <p className="text-slate-700 text-sm">
                              Focus investments on high-impact, low-cost channels identified through the analysis. 
                              Expected ROI improvement within 6 months.
                            </p>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium text-slate-900 mb-1">2. Implement Systematic Testing</h5>
                            <p className="text-slate-700 text-sm">
                              Establish continuous testing framework for ongoing optimization. 
                              Focus on statistically significant improvements.
                            </p>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium text-slate-900 mb-1">3. Scale Successful Interventions</h5>
                            <p className="text-slate-700 text-sm">
                              Prioritize scaling of validated strategies across all relevant channels. 
                              Monitor performance metrics closely during rollout.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-3">Broader Business Implications</h4>
                        <p className="text-blue-800 text-sm leading-relaxed mb-3">
                          This analysis revealed fundamental gaps in our understanding of channel attribution and customer behavior. 
                          The insights challenge traditional assumptions about marketing effectiveness.
                        </p>
                        <p className="text-blue-800 text-sm leading-relaxed">
                          <strong>Key Takeaway:</strong> Data-driven optimization isn't just about measurement—it's about 
                          strategic resource allocation that creates sustainable competitive advantages.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Notes */}
          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Lab Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-slate-900 mb-1">The Hypothesis-Driven Analysis Framework</h4>
                <p className="text-sm text-slate-600 mb-2">Systematic approach to business problem investigation</p>
                <span className="text-xs text-blue-600">Methodology • 10 min read</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-slate-900 mb-1">Building Scalable Analytics Infrastructure</h4>
                <p className="text-sm text-slate-600 mb-2">Technical architecture for data-driven decision making</p>
                <span className="text-xs text-blue-600">Framework • 8 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabNotePreview;
