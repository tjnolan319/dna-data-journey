import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Pin, PinOff, Check, X, ListTodo, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type TodoList = Tables<'todo_lists'>;
type TodoItem = Tables<'todo_items'>;

const AdminTodoLists = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [todoItems, setTodoItems] = useState<{ [key: string]: TodoItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newItemTexts, setNewItemTexts] = useState<{ [key: string]: string }>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editItemText, setEditItemText] = useState('');

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const fetchTodoLists = async () => {
    try {
      const { data: lists, error: listsError } = await supabase
        .from('todo_lists')
        .select('*')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (listsError) throw listsError;

      const { data: items, error: itemsError } = await supabase
        .from('todo_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      setTodoLists(lists || []);
      
      // Group items by list_id
      const itemsByList: { [key: string]: TodoItem[] } = {};
      items?.forEach(item => {
        if (!itemsByList[item.list_id]) {
          itemsByList[item.list_id] = [];
        }
        itemsByList[item.list_id].push(item);
      });
      setTodoItems(itemsByList);

    } catch (error) {
      console.error('Error fetching todo lists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch todo lists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTodoList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from('todo_lists')
        .insert([{
          title: newListTitle,
          description: newListDescription || null,
        }])
        .select()
        .single();

      if (error) throw error;

      setTodoLists(prev => [data, ...prev]);
      setNewListTitle('');
      setNewListDescription('');
      toast({
        title: "List created",
        description: "New todo list has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating todo list:', error);
      toast({
        title: "Error",
        description: "Failed to create todo list.",
        variant: "destructive",
      });
    }
  };

  const updateTodoList = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('todo_lists')
        .update({
          title: editTitle,
          description: editDescription || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTodoLists(prev => prev.map(list => list.id === id ? data : list));
      setEditingList(null);
      setEditTitle('');
      setEditDescription('');
      toast({
        title: "List updated",
        description: "Todo list has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating todo list:', error);
      toast({
        title: "Error",
        description: "Failed to update todo list.",
        variant: "destructive",
      });
    }
  };

  const deleteTodoList = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo list? This will also delete all items in it.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('todo_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodoLists(prev => prev.filter(list => list.id !== id));
      setTodoItems(prev => {
        const newItems = { ...prev };
        delete newItems[id];
        return newItems;
      });
      toast({
        title: "List deleted",
        description: "Todo list has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting todo list:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo list.",
        variant: "destructive",
      });
    }
  };

  const togglePinList = async (id: string, currentPinned: boolean) => {
    try {
      const { data, error } = await supabase
        .from('todo_lists')
        .update({ pinned: !currentPinned })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTodoLists(prev => prev.map(list => list.id === id ? data : list));
      toast({
        title: currentPinned ? "List unpinned" : "List pinned",
        description: `Todo list has been ${currentPinned ? 'unpinned' : 'pinned'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        title: "Error",
        description: error.message.includes('Cannot pin more than 3') 
          ? "Cannot pin more than 3 todo lists at once."
          : "Failed to toggle pin status.",
        variant: "destructive",
      });
    }
  };

  const addTodoItem = async (listId: string) => {
    const text = newItemTexts[listId]?.trim();
    if (!text) return;

    try {
      const { data, error } = await supabase
        .from('todo_items')
        .insert([{
          list_id: listId,
          text: text,
        }])
        .select()
        .single();

      if (error) throw error;

      setTodoItems(prev => ({
        ...prev,
        [listId]: [...(prev[listId] || []), data]
      }));
      setNewItemTexts(prev => ({ ...prev, [listId]: '' }));
    } catch (error) {
      console.error('Error adding todo item:', error);
      toast({
        title: "Error",
        description: "Failed to add todo item.",
        variant: "destructive",
      });
    }
  };

  const toggleTodoItem = async (item: TodoItem) => {
    try {
      const { data, error } = await supabase
        .from('todo_items')
        .update({ completed: !item.completed })
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;

      setTodoItems(prev => ({
        ...prev,
        [item.list_id]: prev[item.list_id].map(i => i.id === item.id ? data : i)
      }));
    } catch (error) {
      console.error('Error toggling todo item:', error);
      toast({
        title: "Error",
        description: "Failed to update todo item.",
        variant: "destructive",
      });
    }
  };

  const updateTodoItem = async (itemId: string, listId: string) => {
    if (!editItemText.trim()) return;

    try {
      const { data, error } = await supabase
        .from('todo_items')
        .update({ text: editItemText.trim() })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      setTodoItems(prev => ({
        ...prev,
        [listId]: prev[listId].map(i => i.id === itemId ? data : i)
      }));
      setEditingItem(null);
      setEditItemText('');
      toast({
        title: "Item updated",
        description: "Todo item has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating todo item:', error);
      toast({
        title: "Error",
        description: "Failed to update todo item.",
        variant: "destructive",
      });
    }
  };

  const deleteTodoItem = async (item: TodoItem) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setTodoItems(prev => ({
        ...prev,
        [item.list_id]: prev[item.list_id].filter(i => i.id !== item.id)
      }));
    } catch (error) {
      console.error('Error deleting todo item:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo item.",
        variant: "destructive",
      });
    }
  };

  const startEditing = (list: TodoList) => {
    setEditingList(list.id);
    setEditTitle(list.title);
    setEditDescription(list.description || '');
  };

  const cancelEditing = () => {
    setEditingList(null);
    setEditTitle('');
    setEditDescription('');
  };

  const startEditingItem = (item: TodoItem) => {
    setEditingItem(item.id);
    setEditItemText(item.text);
  };

  const cancelEditingItem = () => {
    setEditingItem(null);
    setEditItemText('');
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (type === 'list') {
      // Reordering lists - but maintain pinned at top
      const newLists = Array.from(todoLists);
      const [reorderedList] = newLists.splice(source.index, 1);
      
      // Check if we're trying to move a pinned item below unpinned items
      const pinnedCount = todoLists.filter(list => list.pinned).length;
      
      if (reorderedList.pinned && destination.index >= pinnedCount) {
        // Don't allow pinned items to be moved below unpinned items
        return;
      }
      
      if (!reorderedList.pinned && destination.index < pinnedCount) {
        // Don't allow unpinned items to be moved above pinned items
        return;
      }

      newLists.splice(destination.index, 0, reorderedList);
      setTodoLists(newLists);
    } else {
      // Reordering items within a list
      const listId = source.droppableId;
      const items = Array.from(todoItems[listId] || []);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setTodoItems(prev => ({
        ...prev,
        [listId]: items
      }));
    }
  };

  const handleTextareaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, listId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTodoItem(listId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ListTodo className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading todo lists...</p>
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
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <ListTodo className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">To-Do Lists</h1>
              <p className="text-slate-600">Manage your tasks and projects • Drag to reorder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Create New List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="List title"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createTodoList()}
                className="flex-1"
              />
              <Input
                placeholder="Description (optional)"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createTodoList()}
                className="flex-1"
              />
              <Button onClick={createTodoList} disabled={!newListTitle.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo Lists with Drag and Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="lists" type="list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {todoLists.map((list, index) => (
                  <Draggable key={list.id} draggableId={list.id} index={index}>
                    {(provided, snapshot) => (
                      <Card 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${list.pinned ? 'ring-2 ring-blue-500' : ''} ${
                          snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                        }  h-[768px] flex flex-col`}
                      >
                        <CardHeader className="flex-shrink-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {editingList === list.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="font-semibold"
                                  />
                                  <Input
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description"
                                  />
                                  <div className="flex space-x-2">
                                    <Button size="sm" onClick={() => updateTodoList(list.id)}>
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <CardTitle className="flex items-center space-x-2">
                                    <span>{list.title}</span>
                                    {list.pinned && <Pin className="w-4 h-4 text-blue-600" />}
                                  </CardTitle>
                                  {list.description && (
                                    <p className="text-sm text-slate-600 mt-1">{list.description}</p>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <div {...provided.dragHandleProps} className="p-1 cursor-grab hover:bg-slate-100 rounded">
                                <GripVertical className="w-4 h-4 text-slate-400" />
                              </div>
                              {editingList !== list.id && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => togglePinList(list.id, list.pinned)}
                                  >
                                    {list.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => startEditing(list)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteTodoList(list.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col overflow-hidden">
                          {/* Todo Items with Drag and Drop - Scrollable Area */}
                          <div className="flex-1 overflow-y-auto mb-4 pr-2">
                            <Droppable droppableId={list.id} type="item">
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="space-y-2"
                                >
                                  {(todoItems[list.id] || []).map((item, itemIndex) => (
                                    <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={`flex items-center space-x-2 group p-2 rounded ${
                                            snapshot.isDragging ? 'bg-slate-100 shadow-md' : ''
                                          }`}
                                        >
                                          <div {...provided.dragHandleProps} className="cursor-grab">
                                            <GripVertical className="w-3 h-3 text-slate-400" />
                                          </div>
                                          <button
                                            onClick={() => toggleTodoItem(item)}
                                            className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center ${
                                              item.completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-slate-300 hover:border-slate-400'
                                            }`}
                                          >
                                            {item.completed && <Check className="w-3 h-3" />}
                                          </button>
                                          
                                          {editingItem === item.id ? (
                                            <div className="flex-1 flex items-center space-x-2">
                                              <Input
                                                value={editItemText}
                                                onChange={(e) => setEditItemText(e.target.value)}
                                                onKeyPress={(e) => {
                                                  if (e.key === 'Enter') {
                                                    updateTodoItem(item.id, item.list_id);
                                                  } else if (e.key === 'Escape') {
                                                    cancelEditingItem();
                                                  }
                                                }}
                                                className="text-sm"
                                                autoFocus
                                              />
                                              <Button
                                                size="sm"
                                                onClick={() => updateTodoItem(item.id, item.list_id)}
                                                className="h-6 w-6 p-0"
                                              >
                                                <Check className="w-3 h-3" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={cancelEditingItem}
                                                className="h-6 w-6 p-0"
                                              >
                                                <X className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <>
                                              <span className={`flex-1 text-sm break-words ${item.completed ? 'line-through text-slate-500' : ''}`}>
                                                {item.text}
                                              </span>
                                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => startEditingItem(item)}
                                                  className="text-blue-600 hover:text-blue-700 p-1 h-auto"
                                                >
                                                  <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => deleteTodoItem(item)}
                                                  className="text-red-600 hover:text-red-700 p-1 h-auto"
                                                >
                                                  <X className="w-3 h-3" />
                                                </Button>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>

                          {/* Add New Item - Fixed at bottom */}
                          <div className="flex-shrink-0 space-y-2">
                            <Textarea
                              placeholder="Add new item (Enter to add, Shift+Enter for new line)"
                              value={newItemTexts[list.id] || ''}
                              onChange={(e) => setNewItemTexts(prev => ({ 
                                ...prev, 
                                [list.id]: e.target.value 
                              }))}
                              onKeyPress={(e) => handleTextareaKeyPress(e, list.id)}
                              className="resize-none"
                              rows={2}
                            />
                            <Button
                              size="sm"
                              onClick={() => addTodoItem(list.id)}
                              disabled={!newItemTexts[list.id]?.trim()}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Item
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {todoLists.length === 0 && (
          <div className="text-center py-12">
            <ListTodo className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No todo lists yet</h3>
            <p className="text-slate-600">Create your first todo list to get organized.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTodoLists;
