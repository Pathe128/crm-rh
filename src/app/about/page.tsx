'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Building2, 
  Users, 
  Calendar, 
  Shield,
  Zap,
  Heart,
  Target,
  Award
} from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Users,
      title: 'Gestion des Employés',
      description: 'Gérez efficacement votre effectif avec des profils détaillés et une organisation claire.',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Gestion des Congés',
      description: 'Système complet de demande, approbation et suivi des congés en temps réel.',
      color: 'bg-green-500'
    },
    {
      icon: Building2,
      title: 'Organisation',
      description: 'Structurez votre entreprise avec des départements et unités organisationnelles.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Authentification sécurisée et protection des données sensibles.',
      color: 'bg-red-500'
    }
  ];

  const stats = [
    { label: 'Employés Gérés', value: '1000+', icon: Users },
    { label: 'Départements', value: '50+', icon: Building2 },
    { label: 'Demandes Traitées', value: '5000+', icon: Calendar },
    { label: 'Satisfaction', value: '98%', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-10 px-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg mb-4">
            <Building2 className="h-10 w-10 text-primary-content" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">À Propos de RH Manager</h1>
          <p className="text-lg text-gray-600 text-center max-w-xl">
            Application moderne de gestion des ressources humaines conçue pour simplifier et optimiser tous les aspects de la gestion RH.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-4 bg-white/80 shadow-sm border-l-4 border-primary">
              <CardContent>
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <Card className="mb-12 bg-white/90 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
              <Target className="h-6 w-6 text-primary" />
              <span>Notre Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              Simplifier la gestion des ressources humaines en offrant une plateforme intuitive, sécurisée et complète qui permet aux entreprises de se concentrer sur leur cœur de métier tout en optimisant la gestion de leur capital humain.
            </p>
          </CardContent>
        </Card>

        {/* Fonctionnalités */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Fonctionnalités Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 p-4 bg-white/80 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${feature.color} flex-shrink-0`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <Card className="mb-12 bg-white/90 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Technologies Utilisées</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Next.js 15</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">TypeScript</Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Prisma</Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">DaisyUI</Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800">Clerk Auth</Badge>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">SQLite</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Équipe */}
        <Card className="bg-white/90 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Notre Équipe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Développé par une équipe passionnée de développeurs et d&apos;experts RH, RH Manager combine expertise technique et connaissance métier pour offrir la meilleure solution de gestion RH.
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">Version 1.0.0</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">En développement actif</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 