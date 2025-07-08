'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Users,
  Euro,
  ArrowRight,
  BarChart3,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  Star,
  Clock,
  Filter,
  Grid3X3,
  List,
  PieChart,
  Target,
  Award,
  Zap,
  Heart,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

interface Position {
  id: string;
  title: string;
  description: string;
  department?: {
    id: number;
    name: string;
  };
  level: string;
  salaryRange: {
    min: number;
    max: number;
  };
  requirements: string[];
  responsibilities: string[];
  status: 'ACTIVE' | 'INACTIVE';
  employeeCount: number;
  createdAt: string;
  popularity: number; // Score de popularité (1-100)
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  remoteWork: boolean;
  benefits: string[];
}

interface Department {
  id: number;
  name: string;
  description: string;
}

export default function PostesSidebarPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    level: 'JUNIOR',
    salaryMin: '',
    salaryMax: '',
    requirements: '',
    responsibilities: '',
    status: 'ACTIVE',
    difficulty: 'MEDIUM',
    remoteWork: false,
    benefits: ''
  });

  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, []);

  const fetchPositions = async () => {
    try {
      // Simuler des données pour l'exemple
      const mockPositions: Position[] = [
        {
          id: '1',
          title: 'Développeur Full-Stack Senior',
          description: 'Développement d\'applications web modernes avec React et Node.js',
          department: { id: 1, name: 'Développement' },
          level: 'SENIOR',
          salaryRange: { min: 65000, max: 85000 },
          requirements: ['React', 'Node.js', 'TypeScript', '5+ ans d\'expérience'],
          responsibilities: ['Développement frontend/backend', 'Mentorat junior', 'Architecture'],
          status: 'ACTIVE',
          employeeCount: 3,
          createdAt: '2024-01-15',
          popularity: 85,
          difficulty: 'HARD',
          remoteWork: true,
          benefits: ['Télétravail', 'Formation', 'Équipement']
        },
        {
          id: '2',
          title: 'Chef de Projet RH',
          description: 'Gestion des projets RH et amélioration des processus',
          department: { id: 2, name: 'Ressources Humaines' },
          level: 'MANAGER',
          salaryRange: { min: 55000, max: 75000 },
          requirements: ['Gestion de projet', 'RH', '3+ ans d\'expérience'],
          responsibilities: ['Gestion d\'équipe', 'Processus RH', 'Reporting'],
          status: 'ACTIVE',
          employeeCount: 1,
          createdAt: '2024-02-20',
          popularity: 72,
          difficulty: 'MEDIUM',
          remoteWork: false,
          benefits: ['Mutuelle', 'Ticket restaurant', 'Formation']
        },
        {
          id: '3',
          title: 'Développeur Junior',
          description: 'Développement d\'applications web avec supervision',
          department: { id: 1, name: 'Développement' },
          level: 'JUNIOR',
          salaryRange: { min: 35000, max: 45000 },
          requirements: ['JavaScript', 'React', 'Bac+3'],
          responsibilities: ['Développement frontend', 'Tests', 'Documentation'],
          status: 'ACTIVE',
          employeeCount: 2,
          createdAt: '2024-03-10',
          popularity: 95,
          difficulty: 'EASY',
          remoteWork: true,
          benefits: ['Télétravail', 'Mentorat', 'Formation continue']
        },
        {
          id: '4',
          title: 'Designer UX/UI',
          description: 'Création d\'interfaces utilisateur modernes et intuitives',
          department: { id: 3, name: 'Design' },
          level: 'INTERMEDIATE',
          salaryRange: { min: 45000, max: 60000 },
          requirements: ['Figma', 'Adobe Creative Suite', '2+ ans d\'expérience'],
          responsibilities: ['Design d\'interfaces', 'Tests utilisateurs', 'Prototypage'],
          status: 'ACTIVE',
          employeeCount: 1,
          createdAt: '2024-04-05',
          popularity: 88,
          difficulty: 'MEDIUM',
          remoteWork: true,
          benefits: ['Télétravail', 'Équipement design', 'Conférences']
        }
      ];
      setPositions(mockPositions);
    } catch (error) {
      console.error('Erreur lors du chargement des postes:', error);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Générer un ID unique pour les nouveaux postes
      const generateId = () => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `pos_${timestamp}_${randomStr}`;
      };

      const newPosition: Position = {
        id: editingPosition ? editingPosition.id : generateId(),
        title: formData.title,
        description: formData.description,
        department: departments.find(d => d.id.toString() === formData.departmentId),
        level: formData.level as any,
        salaryRange: {
          min: parseFloat(formData.salaryMin) || 0,
          max: parseFloat(formData.salaryMax) || 0
        },
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
        responsibilities: formData.responsibilities.split(',').map(r => r.trim()).filter(r => r),
        status: formData.status as any,
        employeeCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        popularity: Math.floor(Math.random() * 100) + 1,
        difficulty: formData.difficulty as any,
        remoteWork: formData.remoteWork,
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b)
      };

      if (editingPosition) {
        setPositions(prev => prev.map(p => p.id === editingPosition.id ? newPosition : p));
      } else {
        setPositions(prev => [...prev, newPosition]);
      }

      alert(editingPosition ? 'Poste modifié !' : 'Poste créé !');
      setShowAddModal(false);
      setEditingPosition(null);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'opération');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      departmentId: '',
      level: 'JUNIOR',
      salaryMin: '',
      salaryMax: '',
      requirements: '',
      responsibilities: '',
      status: 'ACTIVE',
      difficulty: 'MEDIUM',
      remoteWork: false,
      benefits: ''
    });
  };

  const openEditModal = (position: Position) => {
    setEditingPosition(position);
    setFormData({
      title: position.title,
      description: position.description,
      departmentId: position.department?.id.toString() || '',
      level: position.level,
      salaryMin: position.salaryRange.min.toString(),
      salaryMax: position.salaryRange.max.toString(),
      requirements: position.requirements.join(', '),
      responsibilities: position.responsibilities.join(', '),
      status: position.status,
      difficulty: position.difficulty,
      remoteWork: position.remoteWork,
      benefits: position.benefits.join(', ')
    });
    setShowAddModal(true);
  };

  const openDetailsModal = (position: Position) => {
    setSelectedPosition(position);
    setShowDetailsModal(true);
  };

  const openAddModal = () => {
    setEditingPosition(null);
    resetForm();
    setShowAddModal(true);
  };

  const filteredPositions = positions.filter(position => {
    const matchesSearch = 
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || position.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || 
      position.department?.name === departmentFilter;
    const matchesLevel = levelFilter === 'all' || position.level === levelFilter;
    const matchesDifficulty = difficultyFilter === 'all' || position.difficulty === difficultyFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesLevel && matchesDifficulty;
  });

  const getLevelBadge = (level: string) => {
    const variants = {
      JUNIOR: { color: 'badge-info', text: 'Junior', icon: Star },
      INTERMEDIATE: { color: 'badge-warning', text: 'Intermédiaire', icon: Target },
      SENIOR: { color: 'badge-success', text: 'Senior', icon: Award },
      MANAGER: { color: 'badge-primary', text: 'Manager', icon: Zap },
      DIRECTOR: { color: 'badge-secondary', text: 'Directeur', icon: Rocket }
    };
    return variants[level as keyof typeof variants] || { color: 'badge-outline', text: level, icon: Star };
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      EASY: { color: 'badge-success', text: 'Facile' },
      MEDIUM: { color: 'badge-warning', text: 'Moyen' },
      HARD: { color: 'badge-error', text: 'Difficile' }
    };
    return variants[difficulty as keyof typeof variants] || { color: 'badge-outline', text: difficulty };
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: { color: 'badge-success', text: 'Actif' },
      INACTIVE: { color: 'badge-error', text: 'Inactif' }
    };
    return variants[status as keyof typeof variants] || { color: 'badge-warning', text: status };
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'text-success';
    if (popularity >= 60) return 'text-warning';
    return 'text-error';
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
        {/* Header avec statistiques */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-base-content mb-2">
                Gestion des Postes
              </h1>
              <p className="text-base-content/70 text-lg">
                Découvrez et gérez les opportunités de carrière
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="primary" 
                onClick={openAddModal}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Poste
              </Button>
            </div>
          </div>

          {/* Statistiques avancées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-primary to-primary-focus text-primary-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-content/80">Total Postes</p>
                    <h3 className="text-3xl font-bold">{positions.length}</h3>
                  </div>
                  <Briefcase className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-success to-success-focus text-success-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success-content/80">Postes Actifs</p>
                    <h3 className="text-3xl font-bold">{positions.filter(p => p.status === 'ACTIVE').length}</h3>
                  </div>
                  <TrendingUp className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-warning to-warning-focus text-warning-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning-content/80">Télétravail</p>
                    <h3 className="text-3xl font-bold">{positions.filter(p => p.remoteWork).length}</h3>
                  </div>
                  <MapPin className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-content/80">Popularité Moy.</p>
                    <h3 className="text-3xl font-bold">
                      {Math.round(positions.reduce((sum, p) => sum + p.popularity, 0) / positions.length)}
                    </h3>
                  </div>
                  <Heart className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres avancés */}
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
                      placeholder="Titre, description..."
                      className="input input-bordered w-full pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">📊 Niveau</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                  >
                    <option value="all">Tous les niveaux</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="INTERMEDIATE">Intermédiaire</option>
                    <option value="SENIOR">Senior</option>
                    <option value="MANAGER">Manager</option>
                    <option value="DIRECTOR">Directeur</option>
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
                    <span className="label-text">⚡ Difficulté</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                  >
                    <option value="all">Toutes difficultés</option>
                    <option value="EASY">Facile</option>
                    <option value="MEDIUM">Moyen</option>
                    <option value="HARD">Difficile</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">📈 Statut</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="font-semibold text-base-content mb-3">📊 Aperçu</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Trouvés:</span>
                      <span className="font-medium">{filteredPositions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Télétravail:</span>
                      <span className="font-medium text-success">{filteredPositions.filter(p => p.remoteWork).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affichage des postes */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPositions.map((position) => {
              const levelBadge = getLevelBadge(position.level);
              const difficultyBadge = getDifficultyBadge(position.difficulty);
              const statusBadge = getStatusBadge(position.status);
              const LevelIcon = levelBadge.icon;
              
              return (
                <Card key={position.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div onClick={() => openDetailsModal(position)}>
                    <CardContent className="p-6">
                    {/* Header avec badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="avatar placeholder">
                        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl w-12">
                          <LevelIcon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={levelBadge.color}>
                          {levelBadge.text}
                        </Badge>
                        <Badge className={difficultyBadge.color}>
                          {difficultyBadge.text}
                        </Badge>
                      </div>
                    </div>

                    {/* Titre et description */}
                    <h3 className="font-bold text-xl text-base-content mb-2 group-hover:text-primary transition-colors">
                      {position.title}
                    </h3>
                    <p className="text-base-content/70 mb-4 line-clamp-2">
                      {position.description}
                    </p>

                    {/* Informations clés */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-base-content/50" />
                        <span className="text-base-content/70">{position.department?.name || 'Non assigné'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Euro className="h-4 w-4 text-base-content/50" />
                        <span className="font-medium">
                          {position.salaryRange.min.toLocaleString()} - {position.salaryRange.max.toLocaleString()} €
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-base-content/50" />
                        <span className="text-base-content/70">{position.employeeCount} employé(s)</span>
                      </div>

                      {position.remoteWork && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-success" />
                          <span className="text-success font-medium">Télétravail possible</span>
                        </div>
                      )}
                    </div>

                    {/* Popularité et actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-base-300">
                      <div className="flex items-center gap-2">
                        <Heart className={`h-4 w-4 ${getPopularityColor(position.popularity)}`} />
                        <span className={`text-sm font-medium ${getPopularityColor(position.popularity)}`}>
                          {position.popularity}% popularité
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            openEditModal(position);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            openDetailsModal(position);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="font-semibold">Poste</th>
                      <th className="font-semibold">Département</th>
                      <th className="font-semibold">Niveau</th>
                      <th className="font-semibold">Salaire</th>
                      <th className="font-semibold">Popularité</th>
                      <th className="font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPositions.map((position) => {
                      const levelBadge = getLevelBadge(position.level);
                      const difficultyBadge = getDifficultyBadge(position.difficulty);
                      const LevelIcon = levelBadge.icon;
                      
                      return (
                        <tr key={position.id} className="hover:bg-base-100">
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar placeholder">
                                <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg w-10">
                                  <LevelIcon className="h-5 w-5" />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">{position.title}</div>
                                <div className="text-sm text-base-content/70">{position.description}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-base-content/50" />
                              <span>{position.department?.name || 'Non assigné'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <Badge className={levelBadge.color}>
                                {levelBadge.text}
                              </Badge>
                              <Badge className={difficultyBadge.color}>
                                {difficultyBadge.text}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <div className="font-medium">
                              {position.salaryRange.min.toLocaleString()} - {position.salaryRange.max.toLocaleString()} €
                            </div>
                            <div className="text-sm text-base-content/70">Brut annuel</div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <Heart className={`h-4 w-4 ${getPopularityColor(position.popularity)}`} />
                              <span className={`font-medium ${getPopularityColor(position.popularity)}`}>
                                {position.popularity}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditModal(position)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openDetailsModal(position)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredPositions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content mb-2">
                Aucun poste trouvé
              </h3>
              <p className="text-base-content/70 mb-4">
                {searchTerm ? 'Aucun poste ne correspond à votre recherche.' : 'Aucun poste n\'a encore été créé.'}
              </p>
              <Button variant="primary" onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier poste
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">{selectedPosition.title}</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowDetailsModal(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base-content/80">{selectedPosition.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Prérequis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPosition.requirements.map((req, index) => (
                        <Badge key={index} variant="outline">{req}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Responsabilités
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPosition.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-base-content/80">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Informations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Département:</span>
                      <span className="font-medium">{selectedPosition.department?.name || 'Non assigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Niveau:</span>
                      <Badge className={getLevelBadge(selectedPosition.level).color}>
                        {getLevelBadge(selectedPosition.level).text}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Difficulté:</span>
                      <Badge className={getDifficultyBadge(selectedPosition.difficulty).color}>
                        {getDifficultyBadge(selectedPosition.difficulty).text}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Salaire:</span>
                      <span className="font-medium">
                        {selectedPosition.salaryRange.min.toLocaleString()} - {selectedPosition.salaryRange.max.toLocaleString()} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Employés:</span>
                      <span className="font-medium">{selectedPosition.employeeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Télétravail:</span>
                      <span className={selectedPosition.remoteWork ? 'text-success font-medium' : 'text-base-content/70'}>
                        {selectedPosition.remoteWork ? 'Oui' : 'Non'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Popularité:</span>
                      <span className={`font-medium ${getPopularityColor(selectedPosition.popularity)}`}>
                        {selectedPosition.popularity}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {selectedPosition.benefits.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Avantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPosition.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary">{benefit}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={() => {
                      setShowDetailsModal(false);
                      openEditModal(selectedPosition);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout/édition - Pop-up moderne */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingPosition ? 'Modifier le poste' : 'Créer un nouveau poste'}
                    </h2>
                    <p className="text-primary-content/80">
                      {editingPosition ? 'Modifiez les informations du poste' : 'Remplissez les informations pour créer un nouveau poste'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-content hover:bg-white/20"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPosition(null);
                    resetForm();
                  }}
                >
                  <span className="text-2xl">×</span>
                </Button>
              </div>
            </div>
            
            {/* Contenu du formulaire */}
            <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Informations principales */}
                <div className="bg-base-200/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Informations principales
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Titre du poste *</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:input-primary"
                        placeholder="Ex: Développeur Full-Stack Senior"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Département</span>
                      </label>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        className="select select-bordered w-full focus:select-primary"
                      >
                        <option value="">Sélectionner un département</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="label">
                      <span className="label-text font-medium">Description du poste</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full focus:textarea-primary"
                      rows={3}
                      placeholder="Décrivez les missions principales et les objectifs du poste..."
                    />
                  </div>
                </div>

                {/* Section Détails du poste */}
                <div className="bg-base-200/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Détails du poste
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Niveau</span>
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="select select-bordered w-full focus:select-primary"
                      >
                        <option value="JUNIOR">Junior</option>
                        <option value="INTERMEDIATE">Intermédiaire</option>
                        <option value="SENIOR">Senior</option>
                        <option value="MANAGER">Manager</option>
                        <option value="DIRECTOR">Directeur</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Difficulté</span>
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="select select-bordered w-full focus:select-primary"
                      >
                        <option value="EASY">Facile</option>
                        <option value="MEDIUM">Moyen</option>
                        <option value="HARD">Difficile</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Statut</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="select select-bordered w-full focus:select-primary"
                      >
                        <option value="ACTIVE">Actif</option>
                        <option value="INACTIVE">Inactif</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Salaire minimum (€)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">€</span>
                        <input
                          type="number"
                          name="salaryMin"
                          value={formData.salaryMin}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-8 focus:input-primary"
                          placeholder="35000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Salaire maximum (€)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">€</span>
                        <input
                          type="number"
                          name="salaryMax"
                          value={formData.salaryMax}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-8 focus:input-primary"
                          placeholder="65000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Prérequis et Responsabilités */}
                <div className="bg-base-200/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Prérequis et Responsabilités
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Prérequis</span>
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered w-full focus:textarea-primary"
                        rows={4}
                        placeholder="Ex: React, Node.js, TypeScript, 3 ans d'expérience, Bac+5..."
                      />
                      <div className="text-xs text-base-content/60 mt-1">
                        Séparez les prérequis par des virgules
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Responsabilités</span>
                      </label>
                      <textarea
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered w-full focus:textarea-primary"
                        rows={4}
                        placeholder="Ex: Développement frontend, Mentorat junior, Architecture système..."
                      />
                      <div className="text-xs text-base-content/60 mt-1">
                        Séparez les responsabilités par des virgules
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Avantages et Options */}
                <div className="bg-base-200/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Avantages et Options
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Avantages proposés</span>
                      </label>
                      <textarea
                        name="benefits"
                        value={formData.benefits}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered w-full focus:textarea-primary"
                        rows={3}
                        placeholder="Ex: Télétravail, Formation continue, Équipement fourni, Mutuelle..."
                      />
                      <div className="text-xs text-base-content/60 mt-1">
                        Séparez les avantages par des virgules
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                          <input
                            type="checkbox"
                            name="remoteWork"
                            checked={formData.remoteWork}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <div>
                            <span className="label-text font-medium">Télétravail possible</span>
                            <div className="text-xs text-base-content/60">
                              Le poste peut être exercé en télétravail
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-base-300">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPosition(null);
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
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    {editingPosition ? 'Modifier le poste' : 'Créer le poste'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 