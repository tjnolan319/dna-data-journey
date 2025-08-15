import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Move, GripVertical, Layout, FileText, Image, Code, Save, Upload } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'code' | 'card';
  content: any;
  order: number;
}

interface PortfolioPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_published: boolean;
  content_blocks: ContentBlock[];
  created_at: string;
  updated_at: string;
}

const AdminPortfolioContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<PortfolioPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<PortfolioPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableBlocks, setEditableBlocks] = useState<ContentBlock[]>([]);

  
 useEffect(() => {
  const fetchPages = async () => {
    const { data, error } = await supabase
      .from<PortfolioPage>('portfolio_pages')
      .select('*');
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    setPages(data || []);
    setLoading(false);
  };

  fetchPages();
}, []);


  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'text': return FileText;
      case 'image': return Image;
      case 'code': return Code;
      case 'card': return Layout;
      default: return FileText;
    }
  };

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-700';
      case 'image': return 'bg-green-100 text-green-700';
      case 'code': return 'bg-purple-100 text-purple-700';
      case 'card': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreatePage = () => {
    // TODO: Implement page creation
    toast({
      title: "Feature Coming Soon",
      description: "Portfolio page creation will be implemented next.",
    });
  };

  const handleEditPage = (page: PortfolioPage) => {
    setSelectedPage(page);
    setEditableBlocks([...page.content_blocks]);
    setIsEditing(true);
  };

  const handleDeletePage = (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio page?')) {
      setPages(pages.filter(page => page.id !== pageId));
      toast({
        title: "Page deleted",
        description: "The portfolio page has been successfully deleted.",
      });
    }
  };

  const handlePreviewPage = (page: PortfolioPage) => {
    // Navigate to the actual page
    navigate(`/${page.slug}`);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(editableBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setEditableBlocks(updatedItems);
  };

  const handleAddBlock = (type: 'text' | 'image' | 'code' | 'card') => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: editableBlocks.length
    };
    setEditableBlocks([...editableBlocks, newBlock]);
    toast({
      title: "Block added",
      description: `New ${type} block has been added to the page.`,
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { title: 'New Text Block', subtitle: 'Add your content here' };
      case 'image':
        return { src: '/placeholder.svg', alt: 'New Image', caption: 'Image caption' };
      case 'code':
        return { language: 'javascript', code: '// Add your code here\nconsole.log("Hello World!");' };
      case 'card':
        return { title: 'New Card', sections: [{ title: 'Section', content: 'Add content here' }] };
      default:
        return {};
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      setEditableBlocks(editableBlocks.filter(block => block.id !== blockId));
      toast({
        title: "Block deleted",
        description: "The content block has been removed.",
      });
    }
  };

  const handleSavePage = () => {
    if (selectedPage) {
      const updatedPage = {
        ...selectedPage,
        content_blocks: editableBlocks,
        updated_at: new Date().toISOString()
      };
      
      setPages(pages.map(page => 
        page.id === selectedPage.id ? updatedPage : page
      ));
      
      setSelectedPage(updatedPage);
      
      toast({
        title: "Page saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handlePublishPage = () => {
    if (selectedPage) {
      const updatedPage = {
        ...selectedPage,
        content_blocks: editableBlocks,
        is_published: true,
        updated_at: new Date().toISOString()
      };
      
      setPages(pages.map(page => 
        page.id === selectedPage.id ? updatedPage : page
      ));
      
      setSelectedPage(updatedPage);
      
      toast({
        title: "Page published",
        description: "Your page is now live and visible to visitors.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Layout className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading portfolio content...</p>
        </div>
      </div>
    );
  }

  if (isEditing && selectedPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Pages</span>
              </button>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleSavePage} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </Button>
                <Button onClick={handlePublishPage} className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Publish Changes</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Layout className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Edit: {selectedPage.title}</h1>
                <p className="text-slate-600">Drag and drop components to reorganize the page layout</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Component Library */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { type: 'text', label: 'Text Block', icon: FileText },
                    { type: 'image', label: 'Image', icon: Image },
                    { type: 'code', label: 'Code Block', icon: Code },
                    { type: 'card', label: 'Info Card', icon: Layout }
                  ].map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddBlock(type as 'text' | 'image' | 'code' | 'card')}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Page Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Page Content</span>
                    <span className="text-sm font-normal text-slate-500">
                      {editableBlocks.length} blocks
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="content-blocks">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {editableBlocks
                            .sort((a, b) => a.order - b.order)
                            .map((block, index) => {
                              const Icon = getBlockIcon(block.type);
                              return (
                                <Draggable key={block.id} draggableId={block.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`border border-slate-200 rounded-lg p-4 bg-white transition-shadow ${
                                        snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="cursor-move p-1 hover:bg-slate-100 rounded"
                                          >
                                            <GripVertical className="w-4 h-4 text-slate-400" />
                                          </div>
                                          <Icon className="w-4 h-4 text-slate-600" />
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBlockTypeColor(block.type)}`}>
                                            {block.type}
                                          </span>
                                        </div>
                                        <div className="flex space-x-2">
                                          <Button variant="outline" size="sm">
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleDeleteBlock(block.id)}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Block Preview */}
                                      <div className="bg-slate-50 rounded-md p-3 text-sm">
                                        {block.type === 'text' && (
                                          <div>
                                            <div className="font-semibold">{block.content.title}</div>
                                            {block.content.subtitle && (
                                              <div className="text-slate-600 mt-1">{block.content.subtitle}</div>
                                            )}
                                          </div>
                                        )}
                                        {block.type === 'image' && (
                                          <div>
                                            <div className="font-semibold">Image: {block.content.alt}</div>
                                            <div className="text-slate-600 mt-1">Source: {block.content.src}</div>
                                          </div>
                                        )}
                                        {block.type === 'code' && (
                                          <div>
                                            <div className="font-semibold">Code Block ({block.content.language})</div>
                                            <div className="text-slate-600 mt-1 font-mono text-xs">
                                              {block.content.code.substring(0, 50)}...
                                            </div>
                                          </div>
                                        )}
                                        {block.type === 'card' && (
                                          <div>
                                            <div className="font-semibold">{block.content.title}</div>
                                            <div className="text-slate-600 mt-1">
                                              {block.content.sections?.length || 0} sections
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          {provided.placeholder}

                          {editableBlocks.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                              <Layout className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                              <p>No content blocks yet. Add some components to get started.</p>
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
            <Button onClick={handleCreatePage} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Portfolio Page</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Layout className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Portfolio Content Management</h1>
              <p className="text-slate-600">Create and manage your portfolio pages with drag-and-drop components</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6">
          {pages.map(page => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-xl font-semibold text-slate-900">{page.title}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        page.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4">{page.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>Slug: /{page.slug}</span>
                      <span>•</span>
                      <span>{page.content_blocks.length} components</span>
                      <span>•</span>
                      <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                    </div>

                    {/* Component Preview */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {page.content_blocks.slice(0, 4).map(block => {
                        const Icon = getBlockIcon(block.type);
                        return (
                          <span
                            key={block.id}
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getBlockTypeColor(block.type)}`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{block.type}</span>
                          </span>
                        );
                      })}
                      {page.content_blocks.length > 4 && (
                        <span className="text-xs text-slate-400">
                          +{page.content_blocks.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewPage(page)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPage(page)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="text-center py-12">
            <Layout className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">No portfolio pages yet</h3>
            <p className="text-slate-600 mb-6">Get started by creating your first portfolio page.</p>
            <Button onClick={handleCreatePage}>Create Your First Page</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolioContent;
