import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Settings, Save, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Section {
  id: string;
  section_name: string;
  is_visible: boolean;
  display_order: number;
}

const AdminSectionManager = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: "Error",
        description: "Failed to load sections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSectionVisibility = async (sectionId: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('homepage_sections')
        .update({ is_visible: isVisible })
        .eq('id', sectionId);

      if (error) throw error;

      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, is_visible: isVisible }
          : section
      ));

      toast({
        title: "Success",
        description: `Section ${isVisible ? 'shown' : 'hidden'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section visibility.",
        variant: "destructive",
      });
    }
  };

  const getSectionDisplayName = (sectionName: string) => {
    const nameMap: { [key: string]: string } = {
      'hero': 'Hero Section',
      'tech-stack': 'Tech Stack',
      'projects': 'Projects',
      'timeline': 'Timeline',
      'gallery': 'Data Gallery',
      'contact': 'Contact Form'
    };
    return nameMap[sectionName] || sectionName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getSectionDescription = (sectionName: string) => {
    const descMap: { [key: string]: string } = {
      'hero': 'Main hero section with DNA animation and introduction',
      'tech-stack': 'Technology stack display section',
      'projects': 'Project tabs and portfolio showcase',
      'timeline': 'Academic and professional timeline preview',
      'gallery': 'Data visualization gallery',
      'contact': 'Contact form and information'
    };
    return descMap[sectionName] || `Controls visibility of the ${getSectionDisplayName(sectionName)} section`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Section Manager</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Control which sections are visible on the homepage. Changes take effect immediately for all visitors.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Important Notice</h3>
              <p className="text-blue-800 text-sm">
                Hiding sections will immediately remove them from the public homepage. Use this feature to temporarily disable sections while making updates or when content needs revision.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <Card key={section.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {section.is_visible ? (
                        <Eye className="w-5 h-5 text-green-600" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      )}
                      <h3 className="text-lg font-semibold text-slate-900">
                        {getSectionDisplayName(section.section_name)}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        section.is_visible 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {section.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      {getSectionDescription(section.section_name)}
                    </p>
                    <div className="text-xs text-slate-500">
                      Display order: {section.display_order}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">
                        {section.is_visible ? 'Hide' : 'Show'}
                      </span>
                      <Switch
                        checked={section.is_visible}
                        onCheckedChange={(checked) => updateSectionVisibility(section.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-slate-100 rounded-lg">
          <h3 className="font-medium text-slate-900 mb-2">Next Steps</h3>
          <div className="text-sm text-slate-600 space-y-1">
            <p>• Changes to section visibility are applied immediately</p>
            <p>• Hidden sections will not appear on the homepage for any visitors</p>
            <p>• You can re-enable sections at any time by toggling the switch</p>
            <p>• The section order is currently fixed, but content remains intact when hidden</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSectionManager;