'use client';

import Link from 'next/link';
import { Users, UserCheck, Clock, CheckCircle, Building2, Euro, Plus, CalendarCheck, BarChart3, AlertTriangle, TrendingUp, ThumbsUp } from 'lucide-react';

export default function DashboardRH() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-base-200 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-primary" />
            Espace de Travail RH
          </h1>
          <p className="text-base-content/70 mt-2">Tableau de bord centralisé pour la gestion des ressources humaines</p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Users className="h-6 w-6" />} label="Effectif Total" value="6" sub="Employés enregistrés" color="primary" />
        <StatCard icon={<UserCheck className="h-6 w-6" />} label="Employés Actifs" value="6" sub="Actuellement en poste" color="success" />
        <StatCard icon={<Clock className="h-6 w-6" />} label="Demandes en Attente" value="1" sub="Congés à traiter" color="warning" />
        <StatCard icon={<CheckCircle className="h-6 w-6" />} label="Congés Approuvés" value="3" sub="Cette année" color="info" />
        <StatCard icon={<Building2 className="h-6 w-6" />} label="Départements" value="8" sub="Unités organisationnelles" color="secondary" />
        <StatCard icon={<Euro className="h-6 w-6" />} label="Salaire Moyen" value="13 717€" sub="Brut mensuel" color="accent" />
      </div>

      {/* Actions rapides */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link href="/workspace/Management/Employes" className="flex-1 min-w-[200px]">
          <button className="btn btn-primary w-full">
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un Employé
          </button>
        </Link>
        <Link href="/workspace/Conges/GestionRH" className="flex-1 min-w-[200px]">
          <button className="btn btn-secondary w-full">
            <CalendarCheck className="h-5 w-5 mr-2" />
            Gérer les Congés
          </button>
        </Link>
      </div>

      {/* Analytics & Alertes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Analytics */}
        <div className="card bg-base-100 shadow-lg col-span-2">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-info" />
              <span className="badge badge-info badge-outline">Analytics RH</span>
            </div>
            <h2 className="card-title">Analyses et statistiques</h2>
            <div className="mt-4 h-24 flex items-center justify-center text-base-content/50">
              {/* Placeholder graphique */}
              <span>[Graphique à venir]</span>
            </div>
          </div>
        </div>
        {/* Alertes */}
        <div className="card bg-warning/20 border-l-4 border-warning shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="badge badge-warning">Alertes Système</span>
            </div>
            <h2 className="card-title text-warning">1 demande(s) de congé en attente</h2>
            <p className="text-base-content/70">À traiter</p>
          </div>
        </div>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body flex flex-row items-center gap-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <div className="text-lg font-bold">Taux d'activité</div>
              <div className="text-2xl font-extrabold text-primary">100%</div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body flex flex-row items-center gap-4">
            <ThumbsUp className="h-8 w-8 text-success" />
            <div>
              <div className="text-lg font-bold">Taux d'approbation</div>
              <div className="text-2xl font-extrabold text-success">75%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant de card statistique
function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub: string, color: string }) {
  return (
    <div className={`card bg-gradient-to-br from-${color}/20 to-base-100 shadow-lg`}>
      <div className="card-body flex flex-row items-center gap-4">
        <div className={`p-3 rounded-full bg-${color}/20 text-${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-lg font-bold">{label}</div>
          <div className={`text-2xl font-extrabold text-${color}`}>{value}</div>
          <div className="text-base-content/70">{sub}</div>
        </div>
      </div>
    </div>
  );
} 