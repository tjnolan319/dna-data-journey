import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, Download, Eye, Trash2, CheckCircle, AlertCircle, File, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Resume = Tables<'resumes'>;

const AdminResumeManager = () => {
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch current resume"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({
        type: 'error',
        message: 'Please upload a PDF or Word document only.'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File size must be less than 5MB.'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Generate unique file path
      const timestamp = Date.now();
      const fileName = `resume_${timestamp}_${file.name}`;
      const filePath = fileName;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Deactivate current resume
      if (currentResume) {
        const { error: deactivateError } = await supabase
          .from('resumes')
          .update({ is_active: false })
          .eq('id', currentResume.id);

        if (deactivateError) throw deactivateError;

        // Delete old file from storage
        await supabase.storage
          .from('resumes')
          .remove([currentResume.file_path]);
      }

      // Save resume metadata to database
      const { data: resumeData, error: dbError } = await supabase
        .from('resumes')
        .insert({
          filename: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          is_active: true
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setCurrentResume(resumeData);
      setUploadStatus({
        type: 'success',
        message: `Resume "${file.name}" uploaded successfully!`
      });

      toast({
        title: "Success",
        description: `Resume "${file.name}" uploaded successfully!`
      });

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: 'Upload failed. Please try again.'
      });
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resume.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update download count
      await supabase
        .from('resumes')
        .update({ 
          download_count: resume.download_count + 1,
          last_download: new Date().toISOString()
        })
        .eq('id', resume.id);

      // Refresh data
      fetchCurrentResume();

    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not download resume."
      });
    }
  };

  const handleDelete = async (resume: Resume) => {
    if (!confirm(`Are you sure you want to delete "${resume.filename}"?`)) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([resume.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id);

      if (dbError) throw dbError;

      setCurrentResume(null);
      setUploadStatus({
        type: 'success',
        message: 'Resume deleted successfully.'
      });

      toast({
        title: "Success",
        description: 'Resume deleted successfully.'
      });

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not delete resume."
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else {
      return <File className="w-8 h-8 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading resume manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Admin Dashboard</span>
          </Button>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Resume Management</h1>
          <p className="text-slate-600">Upload and manage your resume file for automatic downloads</p>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            uploadStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {uploadStatus.message}
            </span>
            <button
              onClick={() => setUploadStatus(null)}
              className="ml-auto text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Current Resume Display */}
        {currentResume && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Current Resume</h2>
            <div className="bg-slate-50 rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                {getFileIcon(currentResume.file_type)}
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">
                    {currentResume.filename}
                  </h3>
                  <div className="text-sm text-slate-500 space-y-1">
                    <p>Size: {formatFileSize(currentResume.file_size)}</p>
                    <p>Uploaded: {new Date(currentResume.upload_date).toLocaleDateString()}</p>
                    <p>Downloads: {currentResume.download_count}</p>
                    {currentResume.last_download && (
                      <p>Last downloaded: {new Date(currentResume.last_download).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleDownload(currentResume)}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                  <Button
                    onClick={() => handleDelete(currentResume)}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Upload New Resume</h2>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all bg-white ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-slate-600">Uploading your resume...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Upload className="w-12 h-12 text-slate-400" />
                <div>
                  <p className="text-lg font-medium text-slate-900">Drop your resume here</p>
                  <p className="text-slate-600">or click to select a file</p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <p className="text-sm text-slate-500">
                  Supports PDF and Word documents (max 5MB)
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

      </div>
    </div>
  );
};

export default AdminResumeManager;