import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Move, Eye, EyeOff, Image } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminGalleryManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  });
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order');

      if (error) {
        console.error('Error fetching gallery images:', error);
        toast({
          title: "Error",
          description: "Failed to fetch gallery images.",
          variant: "destructive",
        });
        return;
      }

      setImages(data || []);
    } catch (err) {
      console.error('Error loading gallery images:', err);
      toast({
        title: "Error",
        description: "Failed to load gallery images.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display order
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index
    }));

    setImages(updatedItems);

    // Update database
    try {
      for (const item of updatedItems) {
        const { error } = await supabase
          .from('gallery_images')
          .update({ display_order: item.display_order })
          .eq('id', item.id);

        if (error) {
          console.error('Error updating order:', error);
        }
      }

      toast({
        title: "Order updated",
        description: "Gallery image order has been updated successfully.",
      });
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: "Error",
        description: "Failed to update gallery order.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/') || (!file.type.includes('jpeg') && !file.type.includes('jpg') && !file.type.includes('png'))) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      });
      return null;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleAddImage = async () => {
    if (!formData.title) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title.",
        variant: "destructive",
      });
      return;
    }

    if (uploadMethod === 'url' && !formData.image_url) {
      toast({
        title: "Missing URL",
        description: "Please provide an image URL.",
        variant: "destructive",
      });
      return;
    }

    if (uploadMethod === 'file' && !uploadedFile) {
      toast({
        title: "Missing file",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (uploadMethod === 'file' && uploadedFile) {
        const uploadedUrl = await handleFileUpload(uploadedFile);
        if (!uploadedUrl) {
          setUploading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const { data, error } = await supabase
        .from('gallery_images')
        .insert([{
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          display_order: images.length,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding image:', error);
        toast({
          title: "Error",
          description: "Failed to add gallery image.",
          variant: "destructive",
        });
        return;
      }

      setImages([...images, data]);
      setFormData({ title: '', description: '', image_url: '' });
      setUploadedFile(null);
      setUploadMethod('url');
      setShowAddDialog(false);

      toast({
        title: "Image added",
        description: "Gallery image has been added successfully.",
      });
    } catch (err) {
      console.error('Error adding image:', err);
      toast({
        title: "Error",
        description: "Failed to add gallery image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = async () => {
    if (!editingImage || !formData.title || !formData.image_url) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title and image URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .update({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url
        })
        .eq('id', editingImage.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating image:', error);
        toast({
          title: "Error",
          description: "Failed to update gallery image.",
          variant: "destructive",
        });
        return;
      }

      setImages(images.map(img => img.id === editingImage.id ? data : img));
      setEditingImage(null);
      setFormData({ title: '', description: '', image_url: '' });

      toast({
        title: "Image updated",
        description: "Gallery image has been updated successfully.",
      });
    } catch (err) {
      console.error('Error updating image:', err);
      toast({
        title: "Error",
        description: "Failed to update gallery image.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) {
        console.error('Error deleting image:', error);
        toast({
          title: "Error",
          description: "Failed to delete gallery image.",
          variant: "destructive",
        });
        return;
      }

      setImages(images.filter(img => img.id !== imageId));

      toast({
        title: "Image deleted",
        description: "Gallery image has been deleted successfully.",
      });
    } catch (err) {
      console.error('Error deleting image:', err);
      toast({
        title: "Error",
        description: "Failed to delete gallery image.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (imageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active: !currentStatus })
        .eq('id', imageId);

      if (error) {
        console.error('Error toggling image status:', error);
        toast({
          title: "Error",
          description: "Failed to update image status.",
          variant: "destructive",
        });
        return;
      }

      setImages(images.map(img => 
        img.id === imageId ? { ...img, is_active: !currentStatus } : img
      ));

      toast({
        title: "Status updated",
        description: `Image has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
      });
    } catch (err) {
      console.error('Error toggling image status:', err);
      toast({
        title: "Error",
        description: "Failed to update image status.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      image_url: image.image_url
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadedFile(file);
        setUploadMethod('file');
      } else {
        toast({
          title: "Invalid file type",
          description: "Please drop a JPG or PNG image file.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
      setUploadMethod('file');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', image_url: '' });
    setUploadedFile(null);
    setUploadMethod('url');
    setEditingImage(null);
    setShowAddDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </Button>
              </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Gallery Image</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Image title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Image description"
                      />
                    </div>

                    {/* Upload Method Toggle */}
                    <div className="space-y-2">
                      <Label>Upload Method</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={uploadMethod === 'url' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setUploadMethod('url')}
                        >
                          URL
                        </Button>
                        <Button
                          type="button"
                          variant={uploadMethod === 'file' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setUploadMethod('file')}
                        >
                          File Upload
                        </Button>
                      </div>
                    </div>

                    {uploadMethod === 'url' && (
                      <div>
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    )}

                    {uploadMethod === 'file' && (
                      <div className="space-y-2">
                        <Label>Upload Image File</Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            dragActive
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          {uploadedFile ? (
                            <div className="space-y-2">
                              <Image className="w-8 h-8 mx-auto text-green-600" />
                              <p className="text-sm font-medium text-green-700">
                                {uploadedFile.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setUploadedFile(null)}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 mx-auto text-slate-400" />
                              <p className="text-sm text-slate-600">
                                Drag and drop an image here, or
                              </p>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                              />
                              <label htmlFor="file-upload">
                                <Button type="button" variant="outline" size="sm" asChild>
                                  <span className="cursor-pointer">Browse files</span>
                                </Button>
                              </label>
                              <p className="text-xs text-slate-500">
                                JPG, PNG up to 10MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddImage} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Add Image'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gallery Manager</h1>
              <p className="text-slate-600">Manage your data visualization gallery images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Gallery Images</span>
              <span className="text-sm font-normal text-slate-500">
                {images.length} total images
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="gallery-images">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {images.map((image, index) => (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border border-slate-200 rounded-lg p-4 bg-white transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move p-1 hover:bg-slate-100 rounded"
                              >
                                <Move className="w-4 h-4 text-slate-400" />
                              </div>
                              
                              <div className="w-24 h-16 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={image.image_url}
                                  alt={image.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate">
                                  {image.title}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">
                                  {image.description}
                                </p>
                                <div className="flex items-center mt-2 space-x-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    image.is_active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {image.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Order: {image.display_order}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleActive(image.id, image.is_active)}
                                >
                                  {image.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditDialog(image)}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Gallery Image</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="edit-title">Title</Label>
                                        <Input
                                          id="edit-title"
                                          value={formData.title}
                                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                          placeholder="Image title"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea
                                          id="edit-description"
                                          value={formData.description}
                                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                          placeholder="Image description"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-image_url">Image URL</Label>
                                        <Input
                                          id="edit-image_url"
                                          value={formData.image_url}
                                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                          placeholder="https://example.com/image.jpg"
                                        />
                                      </div>
                                      <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={resetForm}>
                                          Cancel
                                        </Button>
                                        <Button onClick={handleEditImage}>
                                          Update Image
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteImage(image.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {images.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>No gallery images yet. Add some images to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGalleryManager;