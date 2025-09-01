import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have a question, a wholesale inquiry, or just want to say hello? Drop us a line!
            </p>
            <form className="space-y-4">
              <Input placeholder="Your Name" />
              <Input type="email" placeholder="Your Email" />
              <Textarea placeholder="Your Message" />
              <Button type="submit">Send Message</Button>
            </form>
          </div>
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Join the Gusto Club</CardTitle>
                <CardDescription>Get exclusive offers and be the first to know about new products.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex gap-2">
                  <Input type="email" placeholder="Enter your email" className="flex-grow" />
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