'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';
import { 
  User, 
  Calendar, 
  Building2, 
  Mail, 
  Phone,
  MapPin,
  Clock,
  Edit,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Euro,
  Briefcase,
  Crown,
  Users,
  FileText,
  Plus,
  Search,
  Filter,
  FilterX,
  ChevronDown,
  ChevronUp,
  Bell,
  MessageSquare,
  Send,
  AlertCircle,
  Info,
  Shield,
  Trash2
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
    id: number;
    name: string;
  };
  status: string;
  role: string;
  salaireBrut: number;
  startDate: string;
  employmentType: string;
  address?: string;
}

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
  reason?: string;
}

interface Leave {
  id: string;
  leaveType: {
    id: number;
    name: string;
    description?: string;
  };
  startDate: string;
  endDate: string;
  days: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userNote?: string;
  moderatorNote?: string;
  moderator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface LeaveBalance {
  id: number;
  leaveType: {
    id: number;
    name: string;
    description?: string;
    annualQuota: number;
    remuneration: boolean;
  };
  balance: number;
}

interface LeaveType {
  id: number;
  name: string;
  description?: string;
  annualQuota: number;
  remuneration: boolean;
}

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // États pour les congés
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    userNote: ''
  });
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour les notifications
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeProfile();
    }
  }, [employeeId]);

  useEffect(() => {
    if (activeTab === 'leaves') {
      fetchLeaveData();
    }
  }, [activeTab, employeeId]);

  const fetchEmployeeProfile = async () => {
    try {
      const response = await fetch(`/api/users/${employeeId}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
      } else {
        console.error('Employé non trouvé');
        router.push('/workspace/Management/Employes');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateYearsOfService = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  };

  const fetchLeaveData = async () => {
    try {
      const [leavesRes, balancesRes, typesRes] = await Promise.all([
        fetch(`/api/leaves?userId=${employeeId}`),
        fetch(`/api/leave-balances?userId=${employeeId}`),
        fetch('/api/leave-types')
      ]);

      const [leavesData, balancesData, typesData] = await Promise.all([
        leavesRes.json(),
        balancesRes.json(),
        typesRes.json()
      ]);

      console.log('Données récupérées:', { leavesData, balancesData, typesData });

      setLeaves(leavesData);
      setLeaveBalances(balancesData);
      setLeaveTypes(typesData);

      // Si l'utilisateur n'a pas de soldes, les créer automatiquement
      if (balancesData.length === 0 && typesData.length > 0) {
        console.log('Création automatique des soldes pour l\'utilisateur');
        await createDefaultBalances(typesData);
        // Recharger les soldes
        const newBalancesRes = await fetch(`/api/leave-balances?userId=${employeeId}`);
        const newBalancesData = await newBalancesRes.json();
        setLeaveBalances(newBalancesData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de congés:', error);
    }
  };

  const createDefaultBalances = async (types: LeaveType[]) => {
    try {
      for (const type of types) {
        await fetch('/api/leave-balances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: employeeId,
            leaveTypeId: type.id,
            balance: type.annualQuota
          })
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création des soldes par défaut:', error);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    // Validation côté client
    if (!formData.leaveTypeId || !formData.startDate || !formData.endDate) {
      setFormError('Veuillez remplir tous les champs obligatoires');
      setFormLoading(false);
      return;
    }

    const calculatedDays = calculateDays();
    if (calculatedDays <= 0) {
      setFormError('Les dates sélectionnées ne sont pas valides');
      setFormLoading(false);
      return;
    }

    try {
      console.log('Envoi des données:', {
        ...formData,
        days: calculatedDays,
        userId: employeeId
      });

      const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveTypeId: parseInt(formData.leaveTypeId),
          startDate: formData.startDate,
          endDate: formData.endDate,
          userNote: formData.userNote,
          userId: employeeId
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Succès - Afficher notification
        setSuccessMessage('✅ Demande de congé créée avec succès !');
        setShowSuccessNotification(true);
        setShowNewRequestModal(false);
        resetForm();
        fetchLeaveData(); // Recharger les données
        
        // Masquer la notification après 3 secondes
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 3000);
      } else {
        // Erreur - Afficher le message d'erreur
        console.error('Erreur API:', result);
        setFormError(result.error || 'Erreur lors de la création de la demande');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setFormError('Erreur de connexion au serveur');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      leaveTypeId: '',
      startDate: '',
      endDate: '',
      userNote: ''
    });
    setFormError('');
  };

  const openDetailsModal = (leave: Leave) => {
    setSelectedLeave(leave);
    setShowDetailsModal(true);
  };

  const getLeaveStatusBadge = (status: string) => {
    const variants = {
      PENDING: { color: 'badge-warning', text: 'En attente', icon: Clock },
      APPROVED: { color: 'badge-success', text: 'Approuvé', icon: CheckCircle },
      REJECTED: { color: 'badge-error', text: 'Rejeté', icon: XCircle }
    };
    return variants[status as keyof typeof variants] || { color: 'badge-neutral', text: status, icon: AlertCircle };
  };

  const getBalanceColor = (balance: number, quota: number) => {
    const percentage = (balance / quota) * 100;
    if (percentage >= 70) return 'text-success';
    if (percentage >= 40) return 'text-warning';
    return 'text-error';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leave.userNote && leave.userNote.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">
              Employé non trouvé
            </h3>
            <p className="text-base-content/70 mb-4">
              Impossible de charger les informations de l'employé.
            </p>
            <Link href="/workspace/Management/Employes">
              <Button variant="primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusBadge = getStatusBadge(employee.status);
  const roleBadge = getRoleBadge(employee.role);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Notification de succès */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50">
          <div className="alert alert-success shadow-lg">
            <CheckCircle className="h-6 w-6" />
            <span>{successMessage}</span>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => setShowSuccessNotification(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/workspace/Management/Employes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-6">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-20">
                  <span className="text-2xl">{employee.firstName[0]}{employee.lastName[0]}</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-base-content mb-2">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-base-content/70 text-lg mb-3">
                  {employee.jobTitle}
                </p>
                <div className="flex gap-2">
                  <Badge className={statusBadge.color}>
                    {statusBadge.text}
                  </Badge>
                  <Badge className={roleBadge.color}>
                    {roleBadge.text}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="primary" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>

          {/* Onglets */}
          <div className="tabs tabs-boxed">
            <button 
              className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <User className="h-4 w-4 mr-2" />
              Aperçu
            </button>
            <button 
              className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Détails
            </button>
            <button 
              className={`tab ${activeTab === 'leaves' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('leaves')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Congés
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations Principales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Nom complet</span>
                      </label>
                      <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Email</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-base-content/50" />
                        <span>{employee.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Téléphone</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-base-content/50" />
                        <span>{employee.phoneNumber || 'Non renseigné'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Poste</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-base-content/50" />
                        <span>{employee.jobTitle}</span>
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Département</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-base-content/50" />
                        <span>{employee.department?.name || 'Non assigné'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Type de contrat</span>
                      </label>
                      <span>{employee.employmentType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques rapides */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Ancienneté
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {employee.startDate ? calculateYearsOfService(employee.startDate) : 'N/A'}
                    </div>
                    <p className="text-base-content/70">année(s) d'ancienneté</p>
                    {employee.startDate && (
                      <p className="text-sm text-base-content/50 mt-2">
                        Depuis le {formatDate(employee.startDate)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Rémunération
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-2">
                      {employee.salaireBrut ? `${employee.salaireBrut.toLocaleString()} €` : 'Non défini'}
                    </div>
                    <p className="text-base-content/70">Salaire brut annuel</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails Complets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informations Personnelles</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Prénom</span>
                      </label>
                      <p className="font-medium">{employee.firstName}</p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Nom</span>
                      </label>
                      <p className="font-medium">{employee.lastName}</p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Email</span>
                      </label>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Téléphone</span>
                      </label>
                      <p className="font-medium">{employee.phoneNumber || 'Non renseigné'}</p>
                    </div>
                    {employee.address && (
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content/70">Adresse</span>
                        </label>
                        <p className="font-medium">{employee.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informations Professionnelles</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Poste</span>
                      </label>
                      <p className="font-medium">{employee.jobTitle}</p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Département</span>
                      </label>
                      <p className="font-medium">{employee.department?.name || 'Non assigné'}</p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Type de contrat</span>
                      </label>
                      <p className="font-medium">{employee.employmentType}</p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Date d'embauche</span>
                      </label>
                      <p className="font-medium">
                        {employee.startDate ? formatDate(employee.startDate) : 'Non renseignée'}
                      </p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Salaire brut</span>
                      </label>
                      <p className="font-medium">
                        {employee.salaireBrut ? `${employee.salaireBrut.toLocaleString()} €` : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Statut</span>
                      </label>
                      <Badge className={statusBadge.color}>
                        {statusBadge.text}
                      </Badge>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content/70">Rôle</span>
                      </label>
                      <Badge className={roleBadge.color}>
                        {roleBadge.text}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'leaves' && (
          <div className="space-y-6">
            {/* Notifications */}
            {leaves.some(leave => leave.status !== 'PENDING') && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base-content">
                        Vous avez des réponses à vos demandes
                      </h3>
                      <p className="text-sm text-base-content/70">
                        {leaves.filter(l => l.status === 'APPROVED').length} approuvée(s), {leaves.filter(l => l.status === 'REJECTED').length} refusée(s)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Soldes de congés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leaveBalances.map((balance) => {
                const percentage = Math.round((balance.balance / balance.leaveType.annualQuota) * 100);
                const colorClass = getBalanceColor(balance.balance, balance.leaveType.annualQuota);
                
                return (
                  <Card key={balance.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-')}/20`}>
                            <Calendar className={`h-5 w-5 ${colorClass}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base-content">
                              {balance.leaveType.name}
                            </h4>
                            <p className="text-sm text-base-content/70">
                              {balance.leaveType.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-base-content/70">Disponible:</span>
                          <span className={`font-bold text-lg ${colorClass}`}>
                            {balance.balance} jours
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-base-content/70">Quota annuel:</span>
                          <span className="font-medium">
                            {balance.leaveType.annualQuota} jours
                          </span>
                        </div>
                        
                        <div className="w-full bg-base-300 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${colorClass.replace('text-', 'bg-')}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-center">
                          <span className={`text-sm font-medium ${colorClass}`}>
                            {percentage}% restant
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Actions et filtres */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Mes Demandes de Congés</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <Filter className="h-4 w-4 ml-1" />
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => setShowNewRequestModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Demande
                    </Button>
                  </div>
                </div>
                
                {showFilters && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="label">
                        <span className="label-text">🔍 Recherche</span>
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                        <input
                          type="text"
                          placeholder="Type de congé, note..."
                          className="input input-bordered w-full pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">📊 Statut</span>
                      </label>
                      <select 
                        className="select select-bordered w-full"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="PENDING">En attente</option>
                        <option value="APPROVED">Approuvé</option>
                        <option value="REJECTED">Rejeté</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        variant="ghost" 
                        onClick={clearFilters}
                        className="btn-outline"
                      >
                        <FilterX className="h-4 w-4 mr-2" />
                        Effacer
                      </Button>
                    </div>
                  </div>
                )}

                {/* Tableau des demandes */}
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-base-200">
                        <th className="font-semibold">Type</th>
                        <th className="font-semibold">Période</th>
                        <th className="font-semibold">Jours</th>
                        <th className="font-semibold">Statut</th>
                        <th className="font-semibold">Date demande</th>
                        <th className="font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaves.map((leave) => {
                        const statusBadge = getLeaveStatusBadge(leave.status);
                        const StatusIcon = statusBadge.icon;
                        
                        return (
                          <tr key={leave.id} className="hover:bg-base-100">
                            <td>
                              <div className="font-medium">{leave.leaveType.name}</div>
                              {leave.userNote && (
                                <div className="text-sm text-base-content/70 truncate max-w-xs">
                                  "{leave.userNote}"
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="font-medium">
                                {new Date(leave.startDate).toLocaleDateString('fr-FR')} - {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-sm text-base-content/70">
                                {leave.days} jours
                              </div>
                            </td>
                            <td>
                              <div className="font-medium">{leave.days}</div>
                              <div className="text-sm text-base-content/70">jours demandés</div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <Badge className={statusBadge.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusBadge.text}
                                </Badge>
                                
                                {/* Indicateur de notification pour les demandes traitées */}
                                {leave.status !== 'PENDING' && (
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                )}
                                
                                {/* Badge spécial pour les rejets */}
                                {leave.status === 'REJECTED' && (
                                  <Badge className="badge-error badge-sm">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Rejeté
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="font-medium">{new Date(leave.createdAt).toLocaleDateString('fr-FR')}</div>
                              <div className="text-sm text-base-content/70">
                                {new Date(leave.createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openDetailsModal(leave)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {leave.status === 'PENDING' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-error hover:bg-error/20"
                                    onClick={() => {
                                      if (confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
                                        // TODO: Implémenter l'annulation
                                        alert('Fonctionnalité d\'annulation à implémenter');
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredLeaves.length === 0 && (
                  <div className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-base-content mb-2">
                      Aucune demande trouvée
                    </h3>
                    <p className="text-base-content/70 mb-4">
                      {searchTerm ? 'Aucune demande ne correspond à votre recherche.' : 'Vous n\'avez pas encore créé de demande de congé.'}
                    </p>
                    <Button variant="primary" onClick={() => setShowNewRequestModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer votre première demande
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal nouvelle demande */}
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        Nouvelle Demande de Congé
                      </h2>
                      <p className="text-primary-content/80">
                        Remplissez les informations pour votre demande
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-primary-content hover:bg-white/20"
                    onClick={() => {
                      setShowNewRequestModal(false);
                      resetForm();
                    }}
                  >
                    <span className="text-2xl">×</span>
                  </Button>
                </div>
              </div>
              
              <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Type de congé *</span>
                    </label>
                    <select
                      name="leaveTypeId"
                      value={formData.leaveTypeId}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Sélectionner un type de congé</option>
                      {leaveTypes.map(type => {
                        const balance = leaveBalances.find(b => b.leaveType.id === type.id);
                        return (
                          <option key={type.id} value={type.id}>
                            {type.name} ({balance?.balance || 0} jours disponibles)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Date de début *</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Date de fin *</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {calculateDays() > 0 && (
                    <div className="bg-base-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Nombre de jours calculé:</span>
                        <span className="text-lg font-bold text-primary">{calculateDays()} jours</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Note (optionnel)</span>
                    </label>
                    <textarea
                      name="userNote"
                      value={formData.userNote}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      placeholder="Précisez le motif de votre demande..."
                    />
                  </div>

                  {formError && (
                    <div className="alert alert-error shadow-lg">
                      <AlertCircle className="h-5 w-5" />
                      <div>
                        <h3 className="font-bold">Erreur !</h3>
                        <div className="text-sm">{formError}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3 pt-6 border-t border-base-300">
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => {
                        setShowNewRequestModal(false);
                        resetForm();
                      }}
                      className="px-6"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      className="px-8"
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer la demande
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails */}
        {showDetailsModal && selectedLeave && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
              <div className="bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        Détails de la demande
                      </h2>
                      <p className="text-secondary-content/80">
                        Demande de {selectedLeave.leaveType.name}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-secondary-content hover:bg-white/20"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <span className="text-2xl">×</span>
                  </Button>
                </div>
              </div>
              
              <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Détails du congé
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Type:</span>
                          <span className="font-medium">{selectedLeave.leaveType.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Période:</span>
                          <span className="font-medium">
                            {new Date(selectedLeave.startDate).toLocaleDateString('fr-FR')} - {new Date(selectedLeave.endDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Jours:</span>
                          <span className="font-medium">{selectedLeave.days} jours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Statut:</span>
                          <Badge className={getLeaveStatusBadge(selectedLeave.status).color}>
                            {getLeaveStatusBadge(selectedLeave.status).text}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedLeave.userNote && (
                          <div>
                            <h4 className="font-medium mb-2">Votre note:</h4>
                            <p className="text-base-content/80 bg-base-200 p-3 rounded-lg">
                              "{selectedLeave.userNote}"
                            </p>
                          </div>
                        )}
                        
                        {selectedLeave.moderatorNote && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              {selectedLeave.status === 'REJECTED' ? (
                                <>
                                  <XCircle className="h-4 w-4 text-error" />
                                  Motif du rejet:
                                </>
                              ) : selectedLeave.status === 'APPROVED' ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  Commentaire de validation:
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="h-4 w-4 text-primary" />
                                  Note du modérateur:
                                </>
                              )}
                            </h4>
                            <div className={`p-4 rounded-lg border-l-4 ${
                              selectedLeave.status === 'REJECTED' 
                                ? 'bg-error/10 border-error text-error-content' 
                                : selectedLeave.status === 'APPROVED'
                                ? 'bg-success/10 border-success text-success-content'
                                : 'bg-base-200 border-primary'
                            }`}>
                              <p className="font-medium mb-1">
                                {selectedLeave.status === 'REJECTED' && '❌ Demande refusée'}
                                {selectedLeave.status === 'APPROVED' && '✅ Demande approuvée'}
                                {selectedLeave.status === 'PENDING' && '⏳ En cours de traitement'}
                              </p>
                              <p className="text-base-content/80">
                                "{selectedLeave.moderatorNote}"
                              </p>
                              {selectedLeave.moderator && (
                                <p className="text-sm text-base-content/60 mt-2">
                                  — {selectedLeave.moderator.firstName} {selectedLeave.moderator.lastName}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {!selectedLeave.userNote && !selectedLeave.moderatorNote && (
                          <p className="text-base-content/70 text-center py-4">
                            Aucune note pour cette demande
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          Informations système
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Créée le:</span>
                          <span className="font-medium">{new Date(selectedLeave.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Modifiée le:</span>
                          <span className="font-medium">{new Date(selectedLeave.updatedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {selectedLeave.moderator && (
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Modérateur:</span>
                            <span className="font-medium">
                              {selectedLeave.moderator.firstName} {selectedLeave.moderator.lastName}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="h-5 w-5 text-primary" />
                          Conseils
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>Les demandes sont traitées dans un délai de 48h</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>Vous recevrez une notification par email</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>Vous pouvez annuler une demande en attente</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 