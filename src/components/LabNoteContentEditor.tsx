
import React, { useState, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link, X, Image } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lab-notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('lab-notes')
        .getPublicUrl(filePath);

      insertImageAtCursor(`![Image](${data.publicUrl})`);
      
      toast({
        title: "Image uploaded",
        description: "Image has been added to your content.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInsert = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    insertImageAtCursor(`![Image](${imageUrl.trim()})`);
    setImageUrl('');
    setShowImageDialog(false);
    
    toast({
      title: "Image added",
      description: "Image URL has been added to your content.",
    });
  };

  const insertImageAtCursor = (imageMarkdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
    
    onContentChange(tab.id, newContent);
    
    // Set cursor position after the inserted image
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
    }, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {tab.name} Content
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageDialog(true)}
              disabled={isUploading}
            >
              <Image className="w-4 h-4 mr-1" />
              Add Image
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor={tab.id}>{tab.name} Section</Label>
        <div
          className={`relative ${dragActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            id={tab.id}
            value={content}
            onChange={(e) => onContentChange(tab.id, e.target.value)}
            placeholder={`Write your ${tab.name.toLowerCase()} content here. You can use Markdown formatting and drag & drop images.`}
            className={`w-full min-h-[400px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-mono text-sm ${
              tab.id === 'code' ? 'bg-slate-50' : ''
            } ${dragActive ? 'bg-blue-50' : ''}`}
            disabled={isUploading}
          />
          {dragActive && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-300 rounded-md flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-blue-600 font-medium">Drop image here to upload</p>
              </div>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-blue-600 font-medium">Uploading image...</p>
              </div>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
        />
        
        <div className="text-xs text-slate-500 mt-2 space-y-1">
          <p>Tip: You can use Markdown formatting for headings, lists, and emphasis.</p>
          <p>Tip: Use colored boxes with <code className="bg-slate-100 px-1 rounded">~box(color) Your content here ~endbox</code></p>
          <p>Tip: Add images by dragging & dropping files or using the "Add Image" button.</p>
          <p>Available colors: blue, green, yellow, red, purple, orange, gray, indigo, pink, teal</p>
        </div>
      </CardContent>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Image</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowImageDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Upload Image File</Label>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose JPG or PNG file
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={handleUrlInsert} disabled={!imageUrl.trim()}>
                  <Link className="w-4 h-4 mr-2" />
                  Add from URL
                </Button>
                <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LabNoteContentEditor;
