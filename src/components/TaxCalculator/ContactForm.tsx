import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, Phone, Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[+]?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
      });

      if (fnError) {
        throw fnError;
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '' });
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError('Failed to submit. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="card-elevated p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
          <div className="p-3 sm:p-4 rounded-full bg-green-100 mb-3 sm:mb-4">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Thank You!</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            We have received your details. Our tax expert will reach out to you shortly with a personalized tax saving plan.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-purple-100">
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="section-title mb-0 text-base sm:text-lg">Get Personalized Tax Planning</h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
            Fill out these details and we will reach out to you with a detailed tax saving plan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="text-sm sm:text-base"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              Email ID
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="text-sm sm:text-base"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              Contact Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="text-sm sm:text-base"
              maxLength={15}
            />
          </div>
        </div>

        {error && (
          <p className="text-xs sm:text-sm text-red-500">{error}</p>
        )}

        <div className="flex justify-center pt-2">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Request Tax Planning Consultation
              </>
            )}
          </Button>
        </div>
      </form>

      <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-4">
        By submitting, you agree to be contacted by our tax experts regarding personalized tax planning services.
      </p>
    </div>
  );
};
