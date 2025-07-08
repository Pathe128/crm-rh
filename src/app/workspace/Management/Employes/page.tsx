'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Mail,
  Phone,
  Calendar,
  Euro,
  ArrowRight,
  UserPlus,
  User,
  MapPin,
  Clock,
  Download,
  CheckCircle,
  XCircle,
  BarChart3,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department?: {
    name: string;
  };
  status: string;
  role: string;
  salaireBrut: number;
  startDate: string;
  employmentType: string;
}

interface Department {
  id: number;
  name: string;
  description: string;
}

export default function EmployesSidebarPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    startDate: '',
    jobTitle: '',
    departmentId: '',
    employmentType: 'CDI',
    salaireBrut: '',
    role: 'EMPLOYEE',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/positions');
      const data = await response.json();
      setPositions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des postes:', error);
      setPositions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingEmployee 
        ? `/api/users/${editingEmployee.id}`
        : '/api/users';
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
          salaireBrut: parseFloat(formData.salaireBrut) || 0
        }),
      });

      if (response.ok) {
        alert(editingEmployee ? 'Employé modifié !' : 'Employé créé !');
        setShowAddModal(false);
        setEditingEmployee(null);
        resetForm();
        fetchEmployees();
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      startDate: '',
      jobTitle: '',
      departmentId: '',
      employmentType: 'CDI',
      salaireBrut: '',
      role: 'EMPLOYEE',
      status: 'ACTIVE'
    });
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: '',
      phoneNumber: employee.phoneNumber || '',
      address: '',
      startDate: employee.startDate || '',
      jobTitle: employee.jobTitle || '',
      departmentId: employee.department?.name || '',
      employmentType: employee.employmentType || 'CDI',
      salaireBrut: employee.salaireBrut?.toString() || '',
      role: employee.role || 'EMPLOYEE',
      status: employee.status || 'ACTIVE'
    });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    resetForm();
    setShowAddModal(true);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || 
      employee.department?.name === departmentFilter;
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: { color: 'badge-success', text: 'Actif' },
      INACTIVE: { color: 'badge-error', text: 'Inactif' }
    };
    return variants[status as keyof typeof variants] || { color: 'badge-warning', text: status };
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: { color: 'badge-primary', text: 'Admin' },
      RH: { color: 'badge-secondary', text: 'RH' },
      MANAGER: { color: 'badge-accent', text: 'Manager' },
      EMPLOYEE: { color: 'badge-ghost', text: 'Employé' }
    };
    return variants[role as keyof typeof variants] || { color: 'badge-outline', text: role };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-base-200 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Gestion des Employés
          </h1>
          <p className="text-base-content/70 mt-2">{filteredEmployees.length} employé(s) trouvé(s)</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus className="h-5 w-5 mr-2" />
          Nouvel Employé
        </button>
      </div>

      {/* Filtres + Aperçu */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {/* Filtres */}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label"><span className="label-text">Recherche</span></label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
              <input type="text" placeholder="Nom, email, poste..." className="input input-bordered w-full pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label"><span className="label-text">Statut</span></label>
            <select className="select select-bordered w-full" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
            </select>
          </div>
          <div>
            <label className="label"><span className="label-text">Département</span></label>
            <select className="select select-bordered w-full" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
              <option value="all">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label"><span className="label-text">Rôle</span></label>
            <select className="select select-bordered w-full" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="all">Tous les rôles</option>
              <option value="EMPLOYEE">Employé</option>
              <option value="MANAGER">Manager</option>
              <option value="RH">RH</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        {/* Aperçu Statistiques */}
        <div className="bg-base-100 rounded-xl shadow p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-base-content mb-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-info" /> Aperçu
          </h3>
          <div className="flex justify-between text-sm">
            <span>Total:</span> <span className="font-bold">{employees.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Actifs:</span> <span className="font-bold text-success">{employees.filter(e => e.status === 'ACTIVE').length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Inactifs:</span> <span className="font-bold text-error">{employees.filter(e => e.status === 'INACTIVE').length}</span>
          </div>
        </div>
      </div>

      {/* Tableau des employés */}
      <div className="card bg-base-100 shadow-xl">
        <div className="overflow-x-auto rounded-xl">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Employé</th>
                <th>Poste</th>
                <th>Département</th>
                <th>Contact</th>
                <th>Statut</th>
                <th>Rôle</th>
                <th>Salaire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => {
                const statusBadge = getStatusBadge(employee.status);
                const roleBadge = getRoleBadge(employee.role);
                return (
                  <tr key={employee.id} className="hover:bg-base-100">
                    <td className="align-middle text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                            <span>{employee.firstName[0]}{employee.lastName[0]}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-base text-center">{employee.firstName} {employee.lastName}</div>
                          <div className="text-xs text-base-content/70 text-center">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{employee.jobTitle}</div>
                      <div className="text-xs text-base-content/50">{employee.employmentType}</div>
                    </td>
                    <td>
                      <span>{employee.department?.name || 'Non assigné'}</span>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{employee.email}</span>
                        </div>
                        {employee.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{employee.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge.color}`}>{statusBadge.text}</span>
                    </td>
                    <td>
                      <span className={`badge ${roleBadge.color}`}>{roleBadge.text}</span>
                    </td>
                    <td>
                      <span className="font-medium">{employee.salaireBrut ? `${employee.salaireBrut.toLocaleString()} €` : 'Non défini'}</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(employee)}><Edit className="h-4 w-4" /></button>
                        <Link href={`/workspace/Management/Employes/${employee.id}`}><button className="btn btn-ghost btn-sm"><Eye className="h-4 w-4" /></button></Link>
                        <button className="btn btn-ghost btn-sm text-error"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout/édition : harmonisé avec département */}
      {showAddModal && (
        <div className="modal modal-open z-50">
          <div className="modal-box w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingEmployee ? 'Modifier l\'employé' : 'Nouvel employé'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Prénom *</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Nom *</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Email *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              {!editingEmployee && (
                <div>
                  <label className="label">
                    <span className="label-text">Mot de passe *</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required={!editingEmployee}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Téléphone</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Date d'embauche</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Poste</span>
                </label>
                <select
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Sélectionner un poste</option>
                  {positions.map((poste) => (
                    <option key={poste.id} value={poste.title}>{poste.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Département</span>
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Type de contrat</span>
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="STAGE">Stage</option>
                    <option value="ALTERNANCE">Alternance</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Rôle</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="EMPLOYEE">Employé</option>
                    <option value="MANAGER">Manager</option>
                    <option value="RH">RH</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Statut</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Salaire brut (€)</span>
                </label>
                <input
                  type="number"
                  name="salaireBrut"
                  value={formData.salaireBrut}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => { setShowAddModal(false); setEditingEmployee(null); resetForm(); }}>Annuler</Button>
                <Button type="submit" className="btn-primary">{editingEmployee ? 'Enregistrer' : 'Créer'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 