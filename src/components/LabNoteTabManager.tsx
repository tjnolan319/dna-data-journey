
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from 'lucide-react';
import TabConfigEditor from './TabConfigEditor';

interface TabConfig {
  id: string;
  name: string;
  icon: string;
  order: number;
}

interface LabNoteTabManagerProps {
  tabs: TabConfig[];
  onTabsChange: (tabs: TabConfig[]) => void;
}

const LabNoteTabManager: React.FC<LabNoteTabManagerProps> = ({ tabs, onTabsChange }) => {
  const availableTabTemplates = [
    { id: 'analysis', name: 'Analysis', icon: 'microscope' },
    { id: 'methodology', name: 'Methodology', icon: 'settings' },
    { id: 'code', name: 'Code', icon: 'code' },
    { id: 'insights', name: 'Insights', icon: 'lightbulb' },
    { id: 'considerations', name: 'Considerations', icon: 'brain' },
    { id: 'results', name: 'Results', icon: 'chart-bar' },
    { id: 'discussion', name: 'Discussion', icon: 'message-square' },
    { id: 'references', name: 'References', icon: 'file-text' },
    { id: 'appendix', name: 'Appendix', icon: 'folder' },
    { id: 'future-work', name: 'Future Work', icon: 'target' }
  ];

  const addTab = () => {
    if (tabs.length >= 5) return;
    
    // Find a template that's not already used
    const usedIds = tabs.map(tab => tab.id);
    const availableTemplate = availableTabTemplates.find(template => !usedIds.includes(template.id));
    
    if (availableTemplate) {
      const newTab: TabConfig = {
        ...availableTemplate,
        order: tabs.length
      };
      onTabsChange([...tabs, newTab]);
    }
  };

  const removeTab = (tabId: string) => {
    if (tabs.length <= 1) return; // Keep at least one tab
    
    const updatedTabs = tabs
      .filter(tab => tab.id !== tabId)
      .map((tab, index) => ({ ...tab, order: index }));
    
    onTabsChange(updatedTabs);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Tab Management
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">
                {tabs.length}/5 tabs
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={addTab}
                disabled={tabs.length >= 5}
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tab</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-slate-600 mb-4">
              You can have up to 5 content tabs. Drag to reorder, customize names and icons, or remove tabs you don't need.
            </div>
            
            <TabConfigEditor tabs={tabs} onTabsChange={onTabsChange} />
            
            {tabs.length > 1 && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-slate-600 mb-2">Remove tabs:</div>
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant="outline"
                      size="sm"
                      onClick={() => removeTab(tab.id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove {tab.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabNoteTabManager;
