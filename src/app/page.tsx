'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { 
  Building2, 
  Users, 
  Calendar, 
  Shield,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/workspace');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Chargement de l'application RH
          </h1>
          <p className="text-base-content/70">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Redirection vers l'espace de travail
          </h1>
          <p className="text-base-content/70">
            Vous allez être redirigé automatiquement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mr-4">
                <Building2 className="h-8 w-8 text-primary-content" />
              </div>
              <h1 className="text-5xl font-bold text-base-content">
                RH Manager
              </h1>
            </div>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Application moderne de gestion des ressources humaines
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-base-100 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">
                Gestion des Employés
              </h3>
              <p className="text-base-content/70 text-sm">
                Gérez votre effectif, les profils et les équipes
              </p>
            </div>

            <div className="text-center p-6 bg-base-100 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">
                Gestion des Congés
              </h3>
              <p className="text-base-content/70 text-sm">
                Demande, approbation et suivi des congés
              </p>
            </div>

            <div className="text-center p-6 bg-base-100 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">
                Sécurité Avancée
              </h3>
              <p className="text-base-content/70 text-sm">
                Authentification sécurisée et données protégées
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-base-100 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-base-content mb-4">
                Commencez dès maintenant
              </h2>
              <p className="text-base-content/70 mb-6">
                Connectez-vous avec votre compte Google pour accéder à votre espace de travail RH
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-in">
                  <Button variant="primary" size="lg" className="btn-primary">
                    Se connecter
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <Link href="/sign-up">
                  <Button variant="outline" size="lg">
                    Créer un compte
                  </Button>
                </Link>
              </div>
              
              <p className="text-xs text-base-content/50 mt-4">
                En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
