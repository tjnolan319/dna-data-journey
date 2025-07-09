
import React from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TabConfig {
  id: string;
  name: string;
  icon: string;
  order: number;
}

interface LabNoteContentEditorProps {
  tab: TabConfig;
  content: string;
  onContentChange: (tabId: string, content: string) => void;
}

const LabNoteContentEditor: React.FC<LabNoteContentEditorProps> = ({ tab, content, onContentChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tab.name} Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor={tab.id}>{tab.name} Section</Label>
        <textarea
          id={tab.id}
          value={content}
          onChange={(e) => onContentChange(tab.id, e.target.value)}
          placeholder={`Write your ${tab.name.toLowerCase()} content here. You can use Markdown formatting.`}
          className={`w-full min-h-[400px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-mono text-sm ${
            tab.id === 'code' ? 'bg-slate-50' : ''
          }`}
        />
        <div className="text-xs text-slate-500 mt-2 space-y-1">
          <p>Tip: You can use Markdown formatting for headings, lists, and emphasis.</p>
          <p>Tip: Use colored boxes with <code className="bg-slate-100 px-1 rounded">~box(color) Your content here ~endbox</code></p>
          <p>Available colors: blue, green, yellow, red, purple, orange, gray, indigo, pink, teal</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabNoteContentEditor;
