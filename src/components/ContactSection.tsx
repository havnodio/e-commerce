import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setName('');
      setEmail('');
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
              />
              <Input 
                type="email" 
                placeholder="Your Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <Textarea 
                placeholder="Your Message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
              />
              <Button type="submit" disabled={isSubmitting}>
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