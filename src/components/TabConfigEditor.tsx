
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Microscope, 
  Settings, 
  Code, 
  Lightbulb, 
  FlaskConical, 
  Beaker, 
  Atom, 
  Brain, 
  Cpu, 
  Database, 
  Target, 
  Zap,
  ChartBar,
  FileText,
  Search,
  Wrench
} from 'lucide-react';

interface TabConfig {
  id: string;
  name: string;
  icon: string;
  order: number;
}

const iconOptions = [
  { value: 'microscope', label: 'Microscope', icon: Microscope },
  { value: 'settings', label: 'Settings', icon: Settings },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'flask-conical', label: 'Flask', icon: FlaskConical },
  { value: 'beaker', label: 'Beaker', icon: Beaker },
  { value: 'atom', label: 'Atom', icon: Atom },
  { value: 'brain', label: 'Brain', icon: Brain },
  { value: 'cpu', label: 'CPU', icon: Cpu },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'target', label: 'Target', icon: Target },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'chart-bar', label: 'Chart', icon: ChartBar },
  { value: 'file-text', label: 'Document', icon: FileText },
  { value: 'search', label: 'Search', icon: Search },
  { value: 'wrench', label: 'Wrench', icon: Wrench }
];

interface TabConfigEditorProps {
  tabs: TabConfig[];
  onTabsChange: (tabs: TabConfig[]) => void;
}

const TabConfigEditor: React.FC<TabConfigEditorProps> = ({ tabs, onTabsChange }) => {
  const [localTabs, setLocalTabs] = useState<TabConfig[]>(tabs);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(localTabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setLocalTabs(updatedItems);
    onTabsChange(updatedItems);
  };

  const handleTabNameChange = (index: number, newName: string) => {
    const updatedTabs = localTabs.map((tab, i) => 
      i === index ? { ...tab, name: newName } : tab
    );
    setLocalTabs(updatedTabs);
    onTabsChange(updatedTabs);
  };

  const handleTabIconChange = (index: number, newIcon: string) => {
    const updatedTabs = localTabs.map((tab, i) => 
      i === index ? { ...tab, icon: newIcon } : tab
    );
    setLocalTabs(updatedTabs);
    onTabsChange(updatedTabs);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.icon : Lightbulb;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tab Configuration</CardTitle>
        <p className="text-sm text-slate-600">
          Customize the names, icons, and order of your content tabs. Drag to reorder.
        </p>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tabs">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {localTabs
                  .sort((a, b) => a.order - b.order)
                  .map((tab, index) => {
                    const IconComponent = getIconComponent(tab.icon);
                    return (
                      <Draggable key={tab.id} draggableId={tab.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 border border-slate-200 rounded-lg bg-white ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 flex-1">
                                <IconComponent className="w-5 h-5 text-slate-600" />
                                <div className="flex-1">
                                  <Label htmlFor={`tab-name-${tab.id}`} className="text-sm font-medium">
                                    Tab Name
                                  </Label>
                                  <Input
                                    id={`tab-name-${tab.id}`}
                                    value={tab.name}
                                    onChange={(e) => handleTabNameChange(index, e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              <div className="w-48">
                                <Label htmlFor={`tab-icon-${tab.id}`} className="text-sm font-medium">
                                  Icon
                                </Label>
                                <select
                                  id={`tab-icon-${tab.id}`}
                                  value={tab.icon}
                                  onChange={(e) => handleTabIconChange(index, e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {iconOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default TabConfigEditor;
