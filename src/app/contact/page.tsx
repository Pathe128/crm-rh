'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@rhmanager.com',
      description: 'Réponse sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      description: 'Lun-Ven 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: '123 Rue de la Paix, 75001 Paris',
      description: 'Siège social'
    }
  ];

  const faqs = [
    {
      q: "Comment obtenir de l&apos;aide rapidement ?",
      a: "Utilisez le formulaire ou appelez-nous pour une réponse prioritaire."
    },
    {
      q: "Puis-je demander une démo ?",
      a: "Oui, contactez le service commercial pour planifier une démonstration."
    },
    {
      q: "Où trouver la documentation ?",
      a: "Nous vous l'enverrons sur demande ou via l'espace client."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-10 px-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg mb-4">
            <MessageSquare className="h-10 w-10 text-primary-content" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Contactez-nous</h1>
          <p className="text-lg text-gray-600 text-center max-w-xl">
            Notre équipe est à votre écoute pour toute question, suggestion ou demande d'assistance.
          </p>
        </div>

        {/* Bloc principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Infos de contact */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              {contactInfo.map((info, idx) => (
                <Card key={idx} className="flex items-center gap-4 p-4 bg-white/80 shadow-sm border-l-4 border-primary">
                  <div className="bg-primary/10 rounded-full p-3">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{info.title}</div>
                    <div className="text-base text-gray-700">{info.value}</div>
                    <div className="text-xs text-gray-500">{info.description}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 shadow-lg p-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary mb-2">Envoyer un message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full rounded-lg"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full rounded-lg"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full rounded-lg"
                    placeholder="Sujet de votre message"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="textarea textarea-bordered w-full rounded-lg"
                    placeholder="Votre message..."
                  />
                </div>
                <Button type="submit" className="w-full mt-2 rounded-lg text-base font-semibold">Envoyer</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ rapide */}
        <div className="mt-14">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-4 bg-white/80 shadow-sm">
                <div className="font-semibold text-primary mb-2">{faq.q}</div>
                <div className="text-gray-700 text-sm">{faq.a}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 