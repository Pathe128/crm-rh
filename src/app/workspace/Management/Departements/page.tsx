'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Crown,
  Search,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

interface Department {
  id: number;
  name: string;
  description: string;
  users: any[];
  head?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function DepartmentUnitsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headId: ''
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDepartment 
        ? `/api/departments/${editingDepartment.id}`
        : '/api/departments';
      
      const method = editingDepartment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          headId: formData.headId || null
        }),
      });

      if (response.ok) {
        alert(editingDepartment ? 'Département modifié !' : 'Département créé !');
        setShowAddModal(false);
        setEditingDepartment(null);
        resetForm();
        fetchDepartments();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'opération');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      headId: ''
    });
  };

  const openEditModal = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      headId: department.head?.id || ''
    });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingDepartment(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleDeleteDepartment = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce département ?')) return;
    setDeletingId(id);
    try {
      const response = await fetch('/api/departments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');
      fetchDepartments();
    } catch (error) {
      alert('Erreur lors de la suppression du département');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-8 ml-0 md:ml-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Gestion Organisationnelle
              </h1>
              <p className="text-base-content/70">
                Structure des départements et équipes
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={openAddModal}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Département
            </Button>
          </div>
        </div>

        {/* Modal d'ajout/édition de département */}
        {showAddModal && (
          <div className="modal modal-open z-50">
            <div className="modal-box w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingDepartment ? 'Modifier le département' : 'Nouveau département'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Nom du département *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingDepartment(null);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingDepartment ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Départements</div>
            <div className="stat-value text-primary">{departments.length}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Users className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Employés</div>
            <div className="stat-value text-secondary">
              {departments.reduce((sum, dept) => sum + dept.users.length, 0)}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-accent">
              <Crown className="h-8 w-8" />
            </div>
            <div className="stat-title">Avec Chef</div>
            <div className="stat-value text-accent">
              {departments.filter(dept => dept.head).length}
            </div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-base-content mb-2">
                    Employés
                  </h3>
                  <p className="text-base-content/70 text-sm mb-4">
                    Gérer l'effectif et les équipes
                  </p>
                  <Link href="/workspace/employee-management/roster-overview">
                    <Button variant="outline" size="sm">
                      Voir les employés
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-base-content mb-2">
                    Analytics
                  </h3>
                  <p className="text-base-content/70 text-sm mb-4">
                    Rapports et statistiques RH
                  </p>
                  <Link href="/workspace/analytics/insights">
                    <Button variant="outline" size="sm">
                      Voir les rapports
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-base-content mb-2">
                    Dashboard
                  </h3>
                  <p className="text-base-content/70 text-sm mb-4">
                    Retour au tableau de bord
                  </p>
                  <Link href="/workspace">
                    <Button variant="outline" size="sm">
                      Voir le dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vue d'ensemble des départements */}
        <div className="mb-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Building2 className="h-6 w-6 text-primary" />
                Vue d'Ensemble des Départements
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="input input-bordered input-sm pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDepartments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDepartments.slice(0, 6).map((department) => (
                  <div
                    key={department.id}
                    className="p-6 bg-white/60 backdrop-blur border border-primary/30 rounded-3xl shadow-lg flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <span className="badge badge-primary badge-lg mb-2">{department.users.length} membres</span>
                    <h4 className="font-bold text-base-content mb-1 text-lg text-center">{department.name}</h4>
                    <p className="text-sm text-base-content/70 mb-3 text-center">{department.description || 'Aucune description'}</p>
                    {department.head && (
                      <div className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        Chef : {department.head.firstName} {department.head.lastName}
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => openEditModal(department)}
                    >
                      Modifier
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  Aucun département trouvé
                </h3>
                <p className="text-base-content/70">
                  {searchTerm ? 'Aucun département ne correspond à votre recherche.' : 'Aucun département n\'a encore été créé.'}
                </p>
              </div>
            )}
          </CardContent>
        </div>

        {/* Gestion complète des départements */}
        <div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Gestion Complète des Départements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDepartments.map((department) => (
                <Card key={department.id} className="bg-white/60 backdrop-blur border border-primary/30 rounded-3xl shadow-lg flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl">
                  <CardContent className="p-6 w-full flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <span className="badge badge-primary badge-lg mb-2">{department.users.length} membres</span>
                    <h4 className="font-bold text-base-content mb-1 text-lg text-center">{department.name}</h4>
                    <p className="text-sm text-base-content/70 mb-3 text-center">{department.description || 'Aucune description'}</p>
                    {department.head && (
                      <div className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        Chef : {department.head.firstName} {department.head.lastName}
                      </div>
                    )}
                    <div className="flex gap-2 w-full mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openEditModal(department)}
                      >
                        Modifier
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-error border-error"
                        onClick={() => handleDeleteDepartment(department.id)}
                        disabled={deletingId === department.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deletingId === department.id ? 'Suppression...' : 'Supprimer'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDepartments.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  Aucun département trouvé
                </h3>
                <p className="text-base-content/70">
                  {searchTerm ? 'Aucun département ne correspond à votre recherche.' : 'Aucun département n\'a encore été créé.'}
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}