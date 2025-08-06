
import React, { useState, useEffect } from 'react';
import { DNAHero } from "@/components/DNAHero";
import { TimelinePreview } from "@/components/TimelinePreview";
import { Navigation } from "@/components/Navigation";
import { TechStack } from "@/components/TechStack";
import { ProjectTabs } from "@/components/ProjectTabs";
import { DataGallery } from "@/components/DataGallery";
import { ContactForm } from "@/components/ContactForm";
import { supabase } from "@/integrations/supabase/client";

interface HomepageSection {
  id: string;
  section_name: string;
  is_visible: boolean;
  display_order: number;
}

const Index = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      // Show all sections if there's an error
      setSections([
        { id: '1', section_name: 'hero', is_visible: true, display_order: 1 },
        { id: '2', section_name: 'tech-stack', is_visible: true, display_order: 2 },
        { id: '3', section_name: 'projects', is_visible: true, display_order: 3 },
        { id: '4', section_name: 'timeline', is_visible: true, display_order: 4 },
        { id: '5', section_name: 'gallery', is_visible: true, display_order: 5 },
        { id: '6', section_name: 'contact', is_visible: true, display_order: 6 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const isSectionVisible = (sectionName: string) => {
    return sections.some(section => section.section_name === sectionName && section.is_visible);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      {isSectionVisible('hero') && <DNAHero />}
      {isSectionVisible('tech-stack') && <TechStack />}
      {isSectionVisible('projects') && <ProjectTabs />}
      {isSectionVisible('timeline') && <TimelinePreview />}
      {isSectionVisible('gallery') && <DataGallery />}
      {isSectionVisible('contact') && <ContactForm />}
    </div>
  );
};

export default Index;
