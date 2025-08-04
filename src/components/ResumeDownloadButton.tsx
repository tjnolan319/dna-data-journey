import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Resume = Tables<'resumes'>;

const ResumeDownloadButton = () => {
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_active', true)
        .order('upload_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setCurrentResume(data[0]);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleDownload = async () => {
    if (!currentResume) {
      toast({
        variant: "destructive",
        title: "No Resume Available",
        description: "Resume is currently being updated. Please try again later."
      });
      return;
    }

    setIsDownloading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(currentResume.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentResume.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update download count
      await supabase
        .from('resumes')
        .update({ 
          download_count: currentResume.download_count + 1,
          last_download: new Date().toISOString()
        })
        .eq('id', currentResume.id);

      toast({
        title: "Download Started",
        description: `${currentResume.filename} is downloading.`
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not download resume. Please try again."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!currentResume) {
    return (
      <Button 
        variant="outline" 
        disabled
        className="flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>Resume Coming Soon</span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Download className="w-4 h-4" />
      <span>{isDownloading ? 'Downloading...' : 'Download Resume'}</span>
    </Button>
  );
};

export default ResumeDownloadButton;