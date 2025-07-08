"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { RefreshCw } from 'lucide-react';

interface Leave {
  id: string;
  leaveType: { name: string };
  user: { department?: { name: string } };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function DashboardCongesRH() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/leaves')
      .then(res => res.json())
      .then(data => setLeaves(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // Statistiques globales
  const total = leaves.length;
  const approved = leaves.filter(l => l.status === 'APPROVED').length;
  const rejected = leaves.filter(l => l.status === 'REJECTED').length;
  const pending = leaves.filter(l => l.status === 'PENDING').length;
  const thisMonth = leaves.filter(l => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Répartition par statut
  const statusData = [
    { label: 'Approuvées', value: approved, color: 'bg-success/80' },
    { label: 'Refusées', value: rejected, color: 'bg-error/80' },
    { label: 'En attente', value: pending, color: 'bg-warning/80' },
  ];

  // Répartition par type de congé
  const typeMap: Record<string, number> = {};
  leaves.forEach(l => { typeMap[l.leaveType.name] = (typeMap[l.leaveType.name] || 0) + 1; });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // Classement des départements
  const deptMap: Record<string, number> = {};
  leaves.forEach(l => {
    const dept = l.user.department?.name || 'Non assigné';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Statistiques des congés (RH)</h1>
          <Button onClick={fetchData} variant="ghost" className="btn-outline flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Rafraîchir
          </Button>
        </div>
        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-base-content/70">Total demandes</div>
              <div className="text-3xl font-bold">{total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-success/70">Approuvées</div>
              <div className="text-3xl font-bold text-success">{approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-error/70">Refusées</div>
              <div className="text-3xl font-bold text-error">{rejected}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-warning/70">En attente</div>
              <div className="text-3xl font-bold text-warning">{pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-base-content/70">Demandes ce mois</div>
              <div className="text-3xl font-bold">{thisMonth}</div>
            </CardContent>
          </Card>
        </div>
        {/* Graphique camembert statuts */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="relative w-40 h-40">
                {/* Camembert SVG */}
                <svg viewBox="0 0 40 40" width="160" height="160">
                  {(() => {
                    let acc = 0;
                    return statusData.map((d, i) => {
                      const val = total ? d.value / total : 0;
                      const start = acc;
                      const end = acc + val;
                      acc = end;
                      const large = val > 0.5 ? 1 : 0;
                      const x1 = 20 + 20 * Math.sin(2 * Math.PI * start);
                      const y1 = 20 - 20 * Math.cos(2 * Math.PI * start);
                      const x2 = 20 + 20 * Math.sin(2 * Math.PI * end);
                      const y2 = 20 - 20 * Math.cos(2 * Math.PI * end);
                      return (
                        <path
                          key={d.label}
                          d={`M20,20 L${x1},${y1} A20,20 0 ${large} 1 ${x2},${y2} Z`}
                          fill={d.color.replace('/80','')}
                          opacity={val === 0 ? 0.1 : 1}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  {total}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {statusData.map(d => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className={`inline-block w-4 h-4 rounded ${d.color}`}></span>
                    <span className="font-medium">{d.label}</span>
                    <span className="text-base-content/60">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Graphique barres types de congé */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par type de congé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {typeData.length === 0 && <div className="text-base-content/60">Aucune donnée</div>}
              {typeData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-32 truncate">{d.name}</span>
                  <div className="flex-1 bg-base-300 rounded h-4 mx-2">
                    <div className="bg-primary h-4 rounded" style={{ width: `${(d.value/total)*100 || 0}%` }}></div>
                  </div>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Classement départements */}
        <Card>
          <CardHeader>
            <CardTitle>Classement des départements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {deptData.length === 0 && <div className="text-base-content/60">Aucune donnée</div>}
              {deptData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-8 text-right">#{i+1}</span>
                  <span className="w-40 truncate">{d.name}</span>
                  <div className="flex-1 bg-base-300 rounded h-4 mx-2">
                    <div className="bg-secondary h-4 rounded" style={{ width: `${(d.value/total)*100 || 0}%` }}></div>
                  </div>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 