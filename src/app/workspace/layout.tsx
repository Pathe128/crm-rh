'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Building2, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Home,
  Info,
  Phone,
  Palette,
  ChevronDown
} from 'lucide-react';
import { ClerkProvider, SignOutButton, useUser } from "@clerk/nextjs";
import type { Dispatch, SetStateAction } from 'react';

const navigationItems = [
  {
    name: 'Tableau de Bord',
    href: '/workspace',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Management',
    icon: Users,
    description: 'Gestion RH',
    subItems: [
      {
        name: 'Départements',
        href: '/workspace/Management/Departements',
        icon: Building2,
        description: 'Gérer les départements'
      },
      {
        name: 'Employés',
        href: '/workspace/Management/Employes',
        icon: User,
        description: 'Gérer les employés'
      },
      {
        name: 'Postes',
        href: '/workspace/Management/Postes',
        icon: BarChart3,
        description: 'Gérer les postes'
      }
    ]
  },
  {
    name: 'Congés',
    icon: Calendar,
    description: 'Gestion des congés',
    subItems: [
      {
        name: 'Mes Demandes',
        href: '/workspace/Conges/MesDemandes',
        icon: Calendar,
        description: 'Voir mes demandes'
      },
      {
        name: 'Gestion RH',
        href: '/workspace/Conges/GestionRH',
        icon: Users,
        description: 'Gestion RH des congés'
      }
    ]
  },
  {
    name: 'Paramètres',
    icon: Settings,
    description: 'Préférences utilisateur',
    subItems: [
      {
        name: 'Types de Congé',
        href: '/workspace/Parametres/TypesConge',
        icon: Calendar,
        description: 'Gérer les types de congé'
      },
      {
        name: 'Mon Profil',
        href: '/workspace/Parametres/MonProfil',
        icon: User,
        description: 'Voir mon profil'
      }
    ]
  },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);
  const [congesOpen, setCongesOpen] = useState(false);
  const [parametresOpen, setParametresOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Fonction pour obtenir le nom de la page actuelle
  const getCurrentPageName = () => {
    const currentItem = navigationItems.find(item => item.href === pathname);
    return currentItem ? currentItem.name : 'Tableau de Bord';
  };

  return (
    <ClerkProvider>
      <div className="min-h-screen bg-base-200">
        {/* Sidebar Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-base-300">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-content" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-base-content">RH Manager</h1>
                  <p className="text-xs text-base-content/70">Espace de travail</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-base-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                if (item.subItems) {
                  const Icon = item.icon;
                  const activeIndex = item.subItems.findIndex((sub) => pathname === sub.href);
                  // Déterminer l'état d'ouverture et le préfixe d'URL pour chaque menu à sous-menus
                  let isOpen = false;
                  let setOpen: Dispatch<SetStateAction<boolean>> | undefined = undefined;
                  let urlPrefix = '';
                  if (item.name === 'Management') {
                    isOpen = managementOpen;
                    setOpen = setManagementOpen;
                    urlPrefix = '/workspace/Management';
                  } else if (item.name === 'Congés') {
                    isOpen = congesOpen;
                    setOpen = setCongesOpen;
                    urlPrefix = '/workspace/Conges';
                  } else if (item.name === 'Paramètres') {
                    isOpen = parametresOpen;
                    setOpen = setParametresOpen;
                    urlPrefix = '/workspace/Parametres';
                  }
                  const isInSection = pathname.startsWith(urlPrefix);
                  return (
                    <div key={item.name}>
                      <button
                        type="button"
                        className={"flex items-center w-full space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer focus:outline-none text-base-content"}
                        onClick={() => setOpen && setOpen((open) => !open)}
                        aria-expanded={isOpen}
                        aria-controls={`submenu-${item.name}`}
                      >
                        <Icon className={"h-5 w-5 text-base-content/70"} />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-base-content/50">{item.description}</div>
                        </div>
                        <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div id={`submenu-${item.name}`} className="ml-8 space-y-1">
                          {item.subItems.map((sub, idx) => {
                            // Actif si pathname correspond OU si menu ouvert, aucun actif, c'est le premier ET on est dans la section
                            const isActive = pathname === sub.href || (isOpen && activeIndex === -1 && idx === 0 && isInSection);
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm
                                  ${isActive ? 'bg-primary text-primary-content shadow' : 'text-base-content hover:bg-base-200 hover:text-primary'}
                                `}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <SubIcon className={`h-4 w-4 ${isActive ? 'text-primary-content' : 'text-base-content/70 group-hover:text-primary'}`} />
                                <span>{sub.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                // Item simple
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                      ${isActive 
                        ? 'bg-primary text-primary-content shadow-lg' 
                        : 'text-base-content hover:bg-base-200 hover:text-primary'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-primary-content' : 'text-base-content/70 group-hover:text-primary'}`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${isActive ? 'text-primary-content/80' : 'text-base-content/50'}`}>{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-base-300 bg-base-100 shadow-inner">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-base-200/80 shadow-md">
                <div className="avatar placeholder">
                  <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow">
                    <span>
                      {isLoaded && user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '...'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-base-content truncate">
                    {isLoaded && user ? `${user.firstName ?? ''} ${user.lastName ?? ''}` : 'Chargement...'}
                  </div>
                  <div className="text-xs text-base-content/60 truncate">
                    {isLoaded && user ? user.emailAddresses?.[0]?.emailAddress : ''}
                  </div>
                </div>
                <SignOutButton>
                  <button className="p-2 rounded-full hover:bg-red-100 transition-colors" title="Déconnexion">
                    <LogOut className="h-5 w-5 text-red-500" />
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-0 lg:ml-64 transition-all duration-300">
          {/* Top Bar */}
          <div className="bg-base-100 shadow-sm border-b border-base-300 sticky top-0 z-30 mt-4 rounded-xl mx-6">
            <div className="flex items-center justify-between px-6 py-4">
              {/* Colonne 1: Menu mobile + Logo/Nom de page */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-base-200"
                >
                  <Menu className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-content" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-base-content">
                      {getCurrentPageName()}
                    </h2>
                    <p className="text-xs text-base-content/70">RH Manager</p>
                  </div>
                </div>
              </div>

              {/* Colonne 2: Menu de navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/workspace" className="btn btn-ghost btn-sm">
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Link>
                <Link href="/about" className="btn btn-ghost btn-sm">
                  <Info className="h-4 w-4 mr-2" />
                  À propos
                </Link>
                <Link href="/contact" className="btn btn-ghost btn-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Link>
              </div>

              {/* Colonne 3: Thème + Utilisateur */}
              <div className="flex items-center space-x-3">
                {/* Sélecteur de thème */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                    <Palette className="h-4 w-4 mr-2" />
                    Thème
                    <svg
                      width="12px"
                      height="12px"
                      className="inline-block h-2 w-2 fill-current opacity-60 ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 2048 2048">
                      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                    </svg>
                  </div>
                  <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Default"
                        value="default" />
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Retro"
                        value="retro" />
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Cyberpunk"
                        value="cyberpunk" />
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Valentine"
                        value="valentine" />
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Aqua"
                        value="aqua" />
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Lemonade"
                        value="lemonade" />
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Forest"
                        value="forest" />
                    </li>
                    <li>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                        aria-label="Synthwave"
                        value="synthwave" />
                    </li>
                  </ul>
                </div>

                {/* Statut en ligne */}
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="badge badge-primary badge-sm">En ligne</div>
                </div>

                {/* Bouton utilisateur/déconnexion */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-6">
                        <span className="text-xs">A</span>
                      </div>
                    </div>
                  </div>
                  <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
                    <li>
                      <button className="w-full btn btn-sm btn-block btn-ghost justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </button>
                    </li>
                    <li>
                      <SignOutButton>
                        <button className="w-full btn btn-sm btn-block btn-ghost justify-start text-error">
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </button>
                      </SignOutButton>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </ClerkProvider>
  );
} 