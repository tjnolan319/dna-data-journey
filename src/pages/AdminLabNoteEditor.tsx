
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { LabNotePreview } from "@/components/LabNotePreview";
import LabNoteBasicInfo from "@/components/LabNoteBasicInfo";
import LabNoteTabManager from "@/components/LabNoteTabManager";
import LabNoteContentEditor from "@/components/LabNoteContentEditor";
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

type LabNote = Tables<'lab_notes'>;

interface TabConfig {
  id: string;
  name: string;
  icon: string;
  order: number;
}

interface LabNoteFormData {
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  read_time: string;
  date: string;
  published: boolean;
  admin_comments: string;
  content: Record<string, string>;
  tab_config: TabConfig[];
}

const AdminLabNoteEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = id && id !== 'new';

  const defaultTabConfig: TabConfig[] = [
    { id: 'analysis', name: 'Analysis', icon: 'microscope', order: 0 },
    { id: 'methodology', name: 'Methodology', icon: 'settings', order: 1 },
    { id: 'code', name: 'Code', icon: 'code', order: 2 },
    { id: 'insights', name: 'Insights', icon: 'lightbulb', order: 3 },
    { id: 'considerations', name: 'Considerations', icon: 'brain', order: 4 }
  ];

  // Helper function to safely parse tab config from Json
  const parseTabConfig = (tabConfigJson: any): TabConfig[] => {
    if (!tabConfigJson) return defaultTabConfig;
    
    try {
      if (Array.isArray(tabConfigJson)) {
        return tabConfigJson.map((tab: any) => ({
          id: tab.id || '',
          name: tab.name || '',
          icon: tab.icon || 'lightbulb',
          order: tab.order || 0
        }));
      }
      return defaultTabConfig;
    } catch (error) {
      console.error('Error parsing tab config:', error);
      return defaultTabConfig;
    }
  };

  const [formData, setFormData] = useState<LabNoteFormData>({
    title: '',
    excerpt: '',
    category: 'methodology',
    tags: '',
    read_time: '',
    date: new Date().toISOString().split('T')[0],
    published: false,
    admin_comments: '',
    content: {},
    tab_config: defaultTabConfig
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    console.log('AdminLabNoteEditor mounted, isEditing:', isEditing, 'id:', id);
    if (isEditing && id) {
      fetchNote(id);
    } else {
      setInitialLoading(false);
    }
  }, [id, isEditing]);

  const fetchNote = async (noteId: string) => {
    try {
      console.log('Fetching note with ID:', noteId);
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

      console.log('Fetched note data:', data);

      if (data) {
        const tabConfig = parseTabConfig(data.tab_config);
        
        // Build content object from existing data
        const contentObj: Record<string, string> = {};
        if (typeof data.content === 'object' && data.content) {
          Object.keys(data.content as any).forEach(key => {
            contentObj[key] = (data.content as any)[key] || '';
          });
        }
        
        // Ensure all tab IDs have content entries
        tabConfig.forEach(tab => {
          if (!contentObj[tab.id]) {
            contentObj[tab.id] = '';
          }
        });
        
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          category: data.category || 'methodology',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          read_time: data.read_time || '',
          date: data.date || new Date().toISOString().split('T')[0],
          published: Boolean(data.published),
          admin_comments: data.admin_comments || '',
          content: contentObj,
          tab_config: tabConfig
        });
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      toast({
        title: "Error",
        description: "Failed to load the lab note. Please try again.",
        variant: "destructive",
      });
      navigate('/admin/lab-notes');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | TabConfig[]) => {
    console.log('Input change:', field, value);
    if (field === 'tab_config') {
      const newTabs = value as TabConfig[];
      setFormData(prev => {
        // Ensure content object has entries for all tabs
        const newContent = { ...prev.content };
        newTabs.forEach(tab => {
          if (!newContent[tab.id]) {
            newContent[tab.id] = '';
          }
        });
        
        return {
          ...prev,
          tab_config: newTabs,
          content: newContent
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleContentChange = (tabId: string, content: string) => {
    console.log('Content change for tab:', tabId);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [tabId]: content
      }
    }));
  };

  const handleSave = async () => {
    console.log('Saving note...');
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
        admin_comments: formData.admin_comments,
        content: formData.content,
        tab_config: formData.tab_config as any
      };

      console.log('Saving noteData:', noteData);

      if (isEditing && id) {
        const { data, error } = await supabase
          .from('lab_notes')
          .update(noteData as TablesUpdate<'lab_notes'>)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

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

        if (error) throw error;

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
        description: `Failed to ${isEditing ? 'update' : 'create'} the lab note.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    console.log('Opening preview with formData:', formData);
    setPreviewOpen(true);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'microscope': Microscope,
      'settings': Settings,
      'code': Code,
      'lightbulb': Lightbulb,
      'flask-conical': FlaskConical,
      'beaker': Beaker,
      'atom': Atom,
      'brain': Brain,
      'cpu': Cpu,
      'database': Database,
      'target': Target,
      'zap': Zap,
      'chart-bar': ChartBar,
      'file-text': FileText,
      'search': Search,
      'wrench': Wrench
    };
    return iconMap[iconName] || Lightbulb;
  };

  if (initialLoading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lab note...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main component with formData:', formData);

  // Sort tabs by order for display
  const sortedTabs = [...formData.tab_config].sort((a, b) => a.order - b.order);

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
          {/* Fixed Layout: Two rows to prevent wrapping */}
          <div className="space-y-2">
            {/* Row 1: Basic Info and Tab Config */}
            <div className="flex space-x-2">
              <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
              <TabsTrigger value="tabs" className="flex-1">Tab Config</TabsTrigger>
            </div>
            
            {/* Row 2: Content Tabs */}
            <div className="flex space-x-2 overflow-x-auto">
              {sortedTabs.map((tab) => {
                const IconComponent = getIconComponent(tab.icon);
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-1 whitespace-nowrap">
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </TabsTrigger>
                );
              })}
            </div>
          </div>

          <TabsContent value="basic" className="space-y-6">
            <LabNoteBasicInfo
              formData={{
                title: formData.title,
                excerpt: formData.excerpt,
                category: formData.category,
                tags: formData.tags,
                read_time: formData.read_time,
                date: formData.date,
                published: formData.published,
                admin_comments: formData.admin_comments
              }}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="tabs" className="space-y-6">
            <LabNoteTabManager 
              tabs={formData.tab_config}
              onTabsChange={(tabs) => handleInputChange('tab_config', tabs)}
            />
          </TabsContent>

          {sortedTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <LabNoteContentEditor
                tab={tab}
                content={formData.content[tab.id] || ''}
                onContentChange={handleContentChange}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <LabNotePreview
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          formData={formData}
        />
      )}
    </div>
  );
};

export default AdminLabNoteEditor;
