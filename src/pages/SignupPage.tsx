
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Mail, User, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            newsletter_type: 'lab_notes',
            subscribed_at: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to Lab Notes. You'll receive updates about new analytical insights and methodologies.",
      });
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Lab Notes!</h2>
          <p className="text-slate-600 mb-6">
            You've successfully subscribed to receive updates about analytical insights, methodologies, and case studies.
          </p>
          <Button onClick={() => navigate('/')} className="w-full">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-slate-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Homepage
        </button>

        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FlaskConical className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Join Lab Notes</h1>
          <p className="text-slate-600">
            Subscribe to receive deep dives into analytical methodologies, case studies, and professional insights.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-700">Full Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-slate-700">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe to Lab Notes'}
          </Button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          By subscribing, you agree to receive periodic updates about analytical insights and methodologies. 
          You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
