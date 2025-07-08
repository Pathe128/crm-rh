'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Calendar, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  CalendarDays,
  Building2,
  User,
  FileText,
  AlertCircle,
  CheckSquare,
  XSquare,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  FilterX,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Clock3,
  CalendarCheck,
  CalendarX,
  UserCheck,
  UserX,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Euro,
  Star,
  Heart,
  Target,
  Rocket,
  Shield,
  Crown,
  Trophy,
  Medal,
  Flag,
  BookOpen,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  FileCheck,
  FileX,
  FileClock,
  FileText as FileTextIcon,
  Download as DownloadIcon,
  Upload,
  Send,
  MessageSquare,
  Bell,
  Settings,
  HelpCircle,
  Info,
  Plus,
  Minus,
  Divide,
  Percent,
  Hash,
  Hash as HashIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User as UserIcon,
  Building as BuildingIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Clock as ClockIcon2,
  AlertTriangle,
  Info as InfoIcon,
  ExternalLink,
  Link,
  Unlink,
  Lock,
  Unlock,
  Key,
  Shield as ShieldIcon,
  Eye as EyeIcon,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Database,
  HardDrive,
  Cloud,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Battery,
  BatteryCharging,
  Power,
  PowerOff,
  Zap as ZapIcon,
  ZapOff,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Sun as SunIcon,
  Moon as MoonIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Target as TargetIcon,
  Rocket as RocketIcon,
  Shield as ShieldIcon2,
  Crown as CrownIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  Flag as FlagIcon,
  BookOpen as BookOpenIcon,
  Clipboard as ClipboardIcon,
  ClipboardCheck as ClipboardCheckIcon,
  ClipboardList as ClipboardListIcon,
  FileCheck as FileCheckIcon,
  FileX as FileXIcon,
  FileClock as FileClockIcon,
  FileText as FileTextIcon2,
  Download as DownloadIcon2,
  Upload as UploadIcon,
  Send as SendIcon,
  MessageSquare as MessageSquareIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpCircleIcon,
  Info as InfoIcon2,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Divide as DivideIcon,
  Percent as PercentIcon,
  Hash as HashIcon2,
  Calendar as CalendarIcon2,
  Clock as ClockIcon3,
  User as UserIcon2,
  Building as BuildingIcon2,
  CheckCircle as CheckCircleIcon2,
  XCircle as XCircleIcon2,
  Clock as ClockIcon4,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon3,
  ExternalLink as ExternalLinkIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Key as KeyIcon,
  Shield as ShieldIcon3,
  Eye as EyeIcon2,
  EyeOff as EyeOffIcon,
  Sun as SunIcon2,
  Moon as MoonIcon2,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  HardDrive as HardDriveIcon,
  Cloud as CloudIcon2,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Signal as SignalIcon,
  SignalHigh as SignalHighIcon,
  SignalMedium as SignalMediumIcon,
  SignalLow as SignalLowIcon,
  Battery as BatteryIcon,
  BatteryCharging as BatteryChargingIcon,
  Power as PowerIcon,
  PowerOff as PowerOffIcon,
  Zap as ZapIcon2,
  ZapOff as ZapOffIcon,
  Cloud as CloudIcon3,
  CloudRain as CloudRainIcon,
  CloudSnow as CloudSnowIcon,
  CloudLightning as CloudLightningIcon,
  Wind as WindIcon,
  Thermometer as ThermometerIcon,
  Droplets as DropletsIcon,
  Umbrella as UmbrellaIcon
} from 'lucide-react';

interface Leave {
  id: string;
  leaveType: {
    id: number;
    name: string;
    description?: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: {
      id: number;
      name: string;
    };
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

interface Department {
  id: number;
  name: string;
  description?: string;
}

interface LeaveType {
  id: number;
  name: string;
  description?: string;
  annualQuota: number;
  remuneration: boolean;
}

interface LeaveStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisMonth: number;
  approvalRate: number;
}

export default function GestionRHSidebarPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LeaveStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    thisMonth: 0,
    approvalRate: 0
  });

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Actions
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [moderatorNote, setModeratorNote] = useState('');
  const [editStatus, setEditStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle
      const [leavesRes, departmentsRes, leaveTypesRes] = await Promise.all([
        fetch('/api/leaves'),
        fetch('/api/departments'),
        fetch('/api/leave-types')
      ]);

      const [leavesData, departmentsData, leaveTypesData] = await Promise.all([
        leavesRes.json(),
        departmentsRes.json(),
        leaveTypesRes.json()
      ]);

      setLeaves(leavesData);
      setDepartments(departmentsData);
      setLeaveTypes(leaveTypesData);
      
      // Calculer les statistiques
      calculateStats(leavesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leavesData: Leave[]) => {
    const total = leavesData.length;
    const pending = leavesData.filter(l => l.status === 'PENDING').length;
    const approved = leavesData.filter(l => l.status === 'APPROVED').length;
    const rejected = leavesData.filter(l => l.status === 'REJECTED').length;
    
    const thisMonth = leavesData.filter(l => {
      const leaveDate = new Date(l.createdAt);
      const now = new Date();
      return leaveDate.getMonth() === now.getMonth() && 
             leaveDate.getFullYear() === now.getFullYear();
    }).length;

    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    setStats({
      total,
      pending,
      approved,
      rejected,
      thisMonth,
      approvalRate
    });
  };

  const handleAction = async (leaveId: string, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(leaveId);
    try {
      console.log('Envoi de l\'action:', {
        status,
        moderatorNote: moderatorNote || 'Action rapide',
        moderatorId: 'admin-rh'
      });

      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status,
          moderatorNote: moderatorNote || 'Action rapide'
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Succès - Afficher notification
        alert(`✅ Demande ${status === 'APPROVED' ? 'approuvée' : 'refusée'} avec succès !`);
        
        // Mettre à jour la liste avec les données de l'API
        const updatedLeaves = leaves.map(leave => 
          leave.id === leaveId 
            ? { ...leave, ...result, status, moderatorNote: moderatorNote || 'Action rapide' }
            : leave
        );
        setLeaves(updatedLeaves);
        calculateStats(updatedLeaves);
        setModeratorNote('');
      } else {
        // Erreur - Afficher le message d'erreur
        console.error('Erreur API:', result);
        alert(`❌ Erreur: ${result.error || 'Erreur lors de l\'action'}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      alert('❌ Erreur de connexion au serveur');
    } finally {
      setActionLoading(null);
    }
  };

  const openDetailsModal = (leave: Leave) => {
    setSelectedLeave(leave);
    setShowDetailsModal(true);
  };

  const openEditModal = (leave: Leave) => {
    setSelectedLeave(leave);
    setEditStatus(leave.status);
    setEditNote(leave.moderatorNote || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedLeave) return;
    
    // Validation
    if (!editNote.trim()) {
      alert('Veuillez ajouter un commentaire pour justifier votre décision');
      return;
    }
    
    setActionLoading(selectedLeave.id);
    try {
      console.log('Envoi de la modification:', {
        status: editStatus,
        moderatorNote: editNote,
        moderatorId: 'admin-rh' // ID temporaire pour le modérateur
      });

      const response = await fetch(`/api/leaves/${selectedLeave.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: editStatus,
          moderatorNote: editNote
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Succès - Afficher notification
        alert(`✅ Demande ${editStatus === 'APPROVED' ? 'approuvée' : editStatus === 'REJECTED' ? 'refusée' : 'modifiée'} avec succès !`);
        
        // Mettre à jour la liste avec les données de l'API
        const updatedLeaves = leaves.map(leave => 
          leave.id === selectedLeave.id 
            ? { ...leave, ...result, status: editStatus, moderatorNote: editNote }
            : leave
        );
        setLeaves(updatedLeaves);
        calculateStats(updatedLeaves);
        setShowEditModal(false);
        setEditNote('');
      } else {
        // Erreur - Afficher le message d'erreur
        console.error('Erreur API:', result);
        alert(`❌ Erreur: ${result.error || 'Erreur lors de la modification'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('❌ Erreur de connexion au serveur');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { color: 'badge-warning', text: 'En attente', icon: Clock },
      APPROVED: { color: 'badge-success', text: 'Approuvé', icon: CheckCircle },
      REJECTED: { color: 'badge-error', text: 'Rejeté', icon: XCircle }
    };
    return variants[status as keyof typeof variants] || { color: 'badge-neutral', text: status, icon: AlertCircle };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-success';
      case 'PENDING': return 'text-warning';
      case 'REJECTED': return 'text-error';
      default: return 'text-base-content';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || 
      leave.user.department?.name === departmentFilter;
    const matchesLeaveType = leaveTypeFilter === 'all' || 
      leave.leaveType.name === leaveTypeFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const leaveDate = new Date(leave.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = leaveDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = leaveDate >= weekAgo;
          break;
        case 'month':
          matchesDate = leaveDate.getMonth() === now.getMonth() && 
                       leaveDate.getFullYear() === now.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDepartment && matchesLeaveType && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDepartmentFilter('all');
    setLeaveTypeFilter('all');
    setDateFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-base-content mb-2">
                GestionConges
              </h1>
              <p className="text-base-content/70 text-lg">
                Gérez et validez les demandes de congés de votre équipe
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={fetchData}
                className="btn-outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-primary to-primary-focus text-primary-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-content/80">Total Demandes</p>
                    <h3 className="text-3xl font-bold">{stats.total}</h3>
                  </div>
                  <FileText className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-warning to-warning-focus text-warning-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning-content/80">En Attente</p>
                    <h3 className="text-3xl font-bold">{stats.pending}</h3>
                  </div>
                  <Clock className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-success to-success-focus text-success-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success-content/80">Approuvées</p>
                    <h3 className="text-3xl font-bold">{stats.approved}</h3>
                  </div>
                  <CheckCircle className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-content/80">Taux Approbation</p>
                    <h3 className="text-3xl font-bold">{stats.approvalRate}%</h3>
                  </div>
                  <TrendingUp className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
                  <div>
                    <label className="label">
                      <span className="label-text">🔍 Recherche</span>
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                      <input
                        type="text"
                        placeholder="Nom, email, type de congé..."
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

                  <div>
                    <label className="label">
                      <span className="label-text">🏢 Département</span>
                    </label>
                    <select 
                      className="select select-bordered w-full"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="all">Tous les départements</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">📅 Type de congé</span>
                    </label>
                    <select 
                      className="select select-bordered w-full"
                      value={leaveTypeFilter}
                      onChange={(e) => setLeaveTypeFilter(e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      {leaveTypes.map(type => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">📆 Période</span>
                    </label>
                    <select 
                      className="select select-bordered w-full"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option value="all">Toutes les périodes</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                    </select>
                  </div>

                  <div>
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tableau des demandes */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Demandes de Congés ({filteredLeaves.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="font-semibold">Employé</th>
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
                    const statusBadge = getStatusBadge(leave.status);
                    const StatusIcon = statusBadge.icon;
                    
                    return (
                      <tr key={leave.id} className="hover:bg-base-100">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg w-10">
                                <span className="text-sm font-bold">
                                  {leave.user.firstName[0]}{leave.user.lastName[0]}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">
                                {leave.user.firstName} {leave.user.lastName}
                              </div>
                              <div className="text-sm text-base-content/70">
                                {leave.user.department?.name || 'Non assigné'}
                              </div>
                            </div>
                          </div>
                        </td>
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
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </div>
                          <div className="text-sm text-base-content/70">
                            {calculateDays(leave.startDate, leave.endDate)} jours
                          </div>
                        </td>
                        <td>
                          <div className="font-medium">{leave.days}</div>
                          <div className="text-sm text-base-content/70">jours demandés</div>
                        </td>
                        <td>
                          <Badge className={statusBadge.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusBadge.text}
                          </Badge>
                        </td>
                        <td>
                          <div className="font-medium">{formatDate(leave.createdAt)}</div>
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
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-primary hover:bg-primary/20"
                              onClick={() => openEditModal(leave)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            {leave.status === 'PENDING' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-success hover:bg-success/20"
                                  onClick={() => handleAction(leave.id, 'APPROVED')}
                                  disabled={actionLoading === leave.id}
                                >
                                  {actionLoading === leave.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-success"></div>
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-error hover:bg-error/20"
                                  onClick={() => handleAction(leave.id, 'REJECTED')}
                                  disabled={actionLoading === leave.id}
                                >
                                  {actionLoading === leave.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-error"></div>
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              </>
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
                  {searchTerm ? 'Aucune demande ne correspond à votre recherche.' : 'Aucune demande de congé n\'a encore été créée.'}
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  <FilterX className="h-4 w-4 mr-2" />
                  Effacer les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedLeave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Détails de la demande
                    </h2>
                    <p className="text-primary-content/80">
                      Demande de {selectedLeave.user.firstName} {selectedLeave.user.lastName}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-content hover:bg-white/20"
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
                        <User className="h-5 w-5 text-primary" />
                        Informations employé
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Nom:</span>
                        <span className="font-medium">
                          {selectedLeave.user.firstName} {selectedLeave.user.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Email:</span>
                        <span className="font-medium">{selectedLeave.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Département:</span>
                        <span className="font-medium">
                          {selectedLeave.user.department?.name || 'Non assigné'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

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
                          {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Jours:</span>
                        <span className="font-medium">{selectedLeave.days} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Statut:</span>
                        <Badge className={getStatusBadge(selectedLeave.status).color}>
                          {getStatusBadge(selectedLeave.status).text}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
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
                          <h4 className="font-medium mb-2">Note de l'employé:</h4>
                          <p className="text-base-content/80 bg-base-200 p-3 rounded-lg">
                            "{selectedLeave.userNote}"
                          </p>
                        </div>
                      )}
                      
                      {selectedLeave.moderatorNote && (
                        <div>
                          <h4 className="font-medium mb-2">Note du modérateur:</h4>
                          <p className="text-base-content/80 bg-base-200 p-3 rounded-lg">
                            "{selectedLeave.moderatorNote}"
                          </p>
                        </div>
                      )}

                      {selectedLeave.status === 'PENDING' && (
                        <div>
                          <h4 className="font-medium mb-2">Ajouter une note:</h4>
                          <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Note optionnelle pour la décision..."
                            value={moderatorNote}
                            onChange={(e) => setModeratorNote(e.target.value)}
                            rows={3}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {selectedLeave.status === 'PENDING' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-3">
                          <Button 
                            variant="primary"
                            className="flex-1 bg-success hover:bg-success-focus"
                            onClick={() => handleAction(selectedLeave.id, 'APPROVED')}
                            disabled={actionLoading === selectedLeave.id}
                          >
                            {actionLoading === selectedLeave.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approuver
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="primary"
                            className="flex-1 bg-error hover:bg-error-focus"
                            onClick={() => handleAction(selectedLeave.id, 'REJECTED')}
                            disabled={actionLoading === selectedLeave.id}
                          >
                            {actionLoading === selectedLeave.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeter
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

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
                        <span className="font-medium">{formatDate(selectedLeave.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Modifiée le:</span>
                        <span className="font-medium">{formatDate(selectedLeave.updatedAt)}</span>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedLeave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Edit className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Modifier la demande
                    </h2>
                    <p className="text-primary-content/80">
                      Demande de {selectedLeave.user.firstName} {selectedLeave.user.lastName}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-content hover:bg-white/20"
                  onClick={() => setShowEditModal(false)}
                >
                  <span className="text-2xl">×</span>
                </Button>
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
              <div className="space-y-6">
                {/* Informations de la demande */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Détails de la demande
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Employé</label>
                        <p className="font-medium">
                          {selectedLeave.user.firstName} {selectedLeave.user.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Type de congé</label>
                        <p className="font-medium">{selectedLeave.leaveType.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Période</label>
                        <p className="font-medium">
                          {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Jours</label>
                        <p className="font-medium">{selectedLeave.days} jours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulaire de modification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Modifier le statut
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Statut</span>
                      </label>
                      <select 
                        className="select select-bordered w-full"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as 'PENDING' | 'APPROVED' | 'REJECTED')}
                      >
                        <option value="PENDING">En attente</option>
                        <option value="APPROVED">Approuvé</option>
                        <option value="REJECTED">Refusé</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Commentaire</span>
                        <span className="label-text-alt text-base-content/50">Obligatoire</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Expliquez votre décision..."
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="ghost"
                    onClick={() => setShowEditModal(false)}
                    disabled={actionLoading === selectedLeave.id}
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleEditSubmit}
                    disabled={actionLoading === selectedLeave.id || !editNote.trim()}
                  >
                    {actionLoading === selectedLeave.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 