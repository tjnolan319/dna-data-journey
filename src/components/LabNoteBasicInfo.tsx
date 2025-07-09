
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface LabNoteBasicInfoProps {
  formData: {
    title: string;
    excerpt: string;
    category: string;
    tags: string;
    read_time: string;
    date: string;
    published: boolean;
    admin_comments: string;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

const categories = [
  { value: 'methodology', label: 'Methodology' },
  { value: 'case-studies', label: 'Case Studies' },
  { value: 'frameworks', label: 'Frameworks' },
  { value: 'current-events', label: 'Current Events' },
  { value: 'industry-insights', label: 'Industry Insights' },
  { value: 'technical-deep-dive', label: 'Technical Deep Dive' },
  { value: 'best-practices', label: 'Best Practices' }
];

const LabNoteBasicInfo: React.FC<LabNoteBasicInfoProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
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
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="Enter the lab note title"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => onInputChange('excerpt', e.target.value)}
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
                onChange={(e) => onInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                value={formData.read_time}
                onChange={(e) => onInputChange('read_time', e.target.value)}
                placeholder="e.g., 8 min read"
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => onInputChange('date', e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="published">Publication Status</Label>
              <div className="flex items-center space-x-3 p-3 border border-slate-200 rounded-md">
                <span className={`text-sm font-medium ${formData.published ? 'text-green-700' : 'text-red-600'}`}>
                  {formData.published ? 'Published' : 'Draft'}
                </span>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => onInputChange('published', checked)}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-200"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => onInputChange('tags', e.target.value)}
              placeholder="comma, separated, tags"
            />
          </div>

          <div>
            <Label htmlFor="admin_comments">Admin Comments (Private)</Label>
            <textarea
              id="admin_comments"
              value={formData.admin_comments}
              onChange={(e) => onInputChange('admin_comments', e.target.value)}
              placeholder="Private notes for yourself about this lab note..."
              className="w-full min-h-[80px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical bg-yellow-50"
            />
            <div className="text-xs text-slate-500 mt-1">
              These comments are only visible in the admin panel and won't be published.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabNoteBasicInfo;
