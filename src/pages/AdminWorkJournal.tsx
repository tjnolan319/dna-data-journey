
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Save, X, BookOpen, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type JournalEntry = Tables<'journal_entries'>;

const AdminWorkJournal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date_start: new Date().toISOString().split('T')[0],
    date_end: ''
  });

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date_start', { ascending: false });

      if (error) throw error;
      setJournalEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch journal entries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createJournalEntry = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          title: formData.title,
          content: formData.content,
          date_start: formData.date_start,
          date_end: formData.date_end || null,
        }])
        .select()
        .single();

      if (error) throw error;

      setJournalEntries(prev => [data, ...prev]);
      resetForm();
      setShowNewEntryForm(false);
      toast({
        title: "Entry created",
        description: "Journal entry has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to create journal entry.",
        variant: "destructive",
      });
    }
  };

  const updateJournalEntry = async (id: string) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          title: formData.title,
          content: formData.content,
          date_start: formData.date_start,
          date_end: formData.date_end || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setJournalEntries(prev => prev.map(entry => entry.id === id ? data : entry));
      resetForm();
      setEditingEntry(null);
      toast({
        title: "Entry updated",
        description: "Journal entry has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to update journal entry.",
        variant: "destructive",
      });
    }
  };

  const deleteJournalEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setJournalEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Entry deleted",
        description: "Journal entry has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete journal entry.",
        variant: "destructive",
      });
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry.id);
    setFormData({
      title: entry.title,
      content: entry.content,
      date_start: entry.date_start,
      date_end: entry.date_end || ''
    });
    setShowNewEntryForm(false);
  };

  const startNewEntry = () => {
    resetForm();
    setShowNewEntryForm(true);
    setEditingEntry(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      date_start: new Date().toISOString().split('T')[0],
      date_end: ''
    });
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setShowNewEntryForm(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string | null) => {
    if (!endDate) return formatDate(startDate);
    if (startDate === endDate) return formatDate(startDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading work journal...</p>
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
            <Button onClick={startNewEntry} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Work Journal</h1>
              <p className="text-slate-600">Track your daily work and achievements</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search journal entries..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* New Entry Form */}
        {(showNewEntryForm || editingEntry) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Entry title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.date_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Date (optional)
                  </label>
                  <Input
                    type="date"
                    value={formData.date_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_end: e.target.value }))}
                  />
                </div>
              </div>

              <textarea
                placeholder="What did you work on? What did you accomplish? Any challenges or insights?"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full min-h-[200px] px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />

              <div className="flex space-x-2">
                <Button 
                  onClick={() => editingEntry ? updateJournalEntry(editingEntry) : createJournalEntry()}
                  disabled={!formData.title.trim() || !formData.content.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingEntry ? 'Update' : 'Save'} Entry
                </Button>
                <Button variant="outline" onClick={cancelEditing}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{entry.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(entry.date_start, entry.date_end)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(entry)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchTerm ? 'No matching entries found' : 'No journal entries yet'}
            </h3>
            <p className="text-slate-600">
              {searchTerm 
                ? 'Try adjusting your search criteria.'
                : 'Start documenting your work progress and achievements.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkJournal;
