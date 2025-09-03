import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const ContactSection = () => {
  const { user } = useAuth(); // Get the current user from AuthContext
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        setIsProfileLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no row found
          console.error('Error fetching user profile:', error);
          showError("Erreur lors de la récupération de votre profil.");
        } else if (data) {
          setName(`${data.first_name || ''} ${data.last_name || ''}`.trim());
        }
        setEmail(user.email || ''); // Always set email from user object if available
      } else {
        setName('');
        setEmail('');
      }
      setIsProfileLoading(false);
    };

    fetchUserProfile();
  }, [user]); // Re-run when user changes

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !email || !message) {
      showError("Veuillez remplir tous les champs.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({ name, email, message });

      if (error) {
        throw error;
      }

      showSuccess("Votre message a été envoyé avec succès !");
      // Clear message only, name and email might be pre-filled
      setMessage('');
    } catch (error: any) {
      console.error("Error sending message:", error);
      showError("Échec de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for newsletter subscription logic
    showSuccess("Merci de vous être abonné à notre newsletter !");
    // You would typically integrate with a newsletter service here
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have a question, a wholesale inquiry, or just want to say hello? Drop us a line!
            </p>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Input 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                disabled={!!user && !isProfileLoading} // Disable if user is logged in and profile loaded
              />
              <Input 
                type="email" 
                placeholder="Your Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={!!user && !isProfileLoading} // Disable if user is logged in and profile loaded
              />
              <Textarea 
                placeholder="Your Message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
              />
              <Button type="submit" disabled={isSubmitting || isProfileLoading}>
                {isSubmitting ? 'Envoi en cours...' : 'Send Message'}
              </Button>
            </form>
          </div>
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Join the Gusto Club</CardTitle>
                <CardDescription>Get exclusive offers and be the first to know about new products.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input type="email" placeholder="Enter your email" className="flex-grow" required />
                  <Button type="submit">Subscribe</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;