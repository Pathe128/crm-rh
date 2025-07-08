# 🏢 RH Manager - Système de Gestion des Ressources Humaines

Une application moderne de gestion RH construite avec Next.js, Prisma, et DaisyUI pour une expérience utilisateur optimale.

## ✨ Fonctionnalités

### 👥 Gestion des Employés
- **Roster Overview** : Vue d'ensemble de tous les employés avec filtres et recherche
- **Ajout d'Employés** : Formulaire complet pour créer de nouveaux employés
- **Profils Détaillés** : Pages de profil avec informations personnelles et professionnelles
- **Gestion des Départements** : Attribution et modification des départements

### 📅 Gestion des Congés
- **Centre de Demandes** : Interface pour soumettre et gérer les demandes de congés
- **Nouvelles Demandes** : Formulaire intuitif pour créer des demandes
- **Types de Congés** : Configuration des différents types (payés, maladie, formation, etc.)
- **Approbation/Rejet** : Workflow de validation des demandes
- **Soldes de Congés** : Suivi automatique des jours restants

### 🏢 Gestion Organisationnelle
- **Départements** : Création et gestion des unités organisationnelles
- **Structure Hiérarchique** : Attribution des chefs de département
- **Statistiques par Département** : Métriques et répartition des effectifs

### 📊 Analytics et Rapports
- **Tableau de Bord Analytique** : Métriques clés en temps réel
- **Statistiques de Congés** : Taux d'approbation, types les plus utilisés
- **Répartition Géographique** : Analyse par département
- **Évolution Temporelle** : Graphiques d'évolution des demandes

### ⚙️ Configuration et Paramètres
- **Profil Utilisateur** : Gestion des informations personnelles
- **Notifications** : Configuration des canaux et types de notifications
- **Sécurité** : Paramètres de sécurité et authentification
- **Apparence** : Personnalisation du thème et de l'interface
- **Langue** : Support multilingue (FR, EN, ES)

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **DaisyUI** : Composants UI modernes et accessibles
- **Tailwind CSS** : Framework CSS utilitaire
- **Lucide React** : Icônes modernes et cohérentes

### Backend
- **Prisma** : ORM moderne pour la gestion de base de données
- **SQLite** : Base de données légère pour le développement
- **Next.js API Routes** : API REST intégrée

### Authentification
- **Clerk** : Solution d'authentification moderne et sécurisée

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### 1. Cloner le projet
```bash
git clone <repository-url>
cd my-crm-rh
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
Créer un fichier `.env.local` à la racine du projet :
```env
# Base de données
DATABASE_URL="file:./dev.db"

# Clerk (Authentification)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# URL de l'application
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/workspace
```

### 4. Configuration de la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev

# (Optionnel) Réinitialiser la base de données
npx prisma migrate reset

# (Optionnel) Seeder avec des données de test
npm run seed
```

### 5. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
my-crm-rh/
├── src/
│   ├── app/
│   │   ├── api/                    # Routes API
│   │   │   ├── departments/        # Gestion des départements
│   │   │   ├── leave-types/        # Types de congés
│   │   │   ├── leave-balances/     # Soldes de congés
│   │   │   ├── leaves/             # Demandes de congés
│   │   │   └── users/              # Gestion des utilisateurs
│   │   ├── workspace/              # Interface principale
│   │   │   ├── employee-management/ # Gestion des employés
│   │   │   ├── leave-management/   # Gestion des congés
│   │   │   ├── department-management/ # Gestion des départements
│   │   │   ├── analytics/          # Rapports et statistiques
│   │   │   └── settings/           # Paramètres
│   │   ├── sign-in/                # Page de connexion
│   │   └── sign-up/                # Page d'inscription
│   ├── components/
│   │   ├── ui/                     # Composants UI réutilisables
│   │   └── navigation/             # Composants de navigation
│   ├── lib/
│   │   ├── prisma.ts              # Configuration Prisma
│   │   └── data/                  # Fonctions d'accès aux données
│   └── shared/
│       └── components/            # Composants partagés
├── prisma/
│   ├── schema.prisma              # Schéma de base de données
│   ├── migrations/                # Migrations de base de données
│   └── seed.js                    # Script de seeding
└── public/                        # Fichiers statiques
```

## 🗄️ Modèle de Données

### Utilisateurs
- Informations personnelles (nom, email, téléphone)
- Informations professionnelles (poste, département, salaire)
- Rôles et permissions

### Départements
- Nom et description
- Chef de département
- Employés associés

### Types de Congés
- Nom et description
- Jours par défaut
- Couleur d'identification
- Configuration d'approbation

### Demandes de Congés
- Type de congé
- Dates de début et fin
- Statut (en attente, approuvé, rejeté)
- Justificatifs

### Soldes de Congés
- Utilisateur et type de congé
- Jours accordés et utilisés
- Calcul automatique des jours restants

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Lancer le serveur de développement
npm run build        # Construire pour la production
npm run start        # Lancer en mode production

# Base de données
npm run db:generate  # Générer le client Prisma
npm run db:migrate   # Appliquer les migrations
npm run db:reset     # Réinitialiser la base de données
npm run db:seed      # Seeder avec des données de test

# Linting et formatage
npm run lint         # Vérifier le code avec ESLint
npm run lint:fix     # Corriger automatiquement les erreurs
```

## 🎨 Personnalisation

### Thèmes DaisyUI
L'application utilise DaisyUI avec des thèmes personnalisables. Modifiez le fichier `tailwind.config.js` pour changer les couleurs :

```javascript
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3B82F6",
          "secondary": "#8B5CF6",
          "accent": "#F59E0B",
          "neutral": "#374151",
          "base-100": "#FFFFFF",
          "info": "#06B6D4",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
    ],
  },
}
```

### Composants UI
Les composants sont modulaires et réutilisables. Ils se trouvent dans `src/shared/components/ui/` et peuvent être facilement personnalisés.

## 🔒 Sécurité

- **Authentification** : Gérée par Clerk avec support multi-facteurs
- **Autorisation** : Contrôle d'accès basé sur les rôles
- **Validation** : Validation côté client et serveur
- **CSRF Protection** : Protection intégrée dans Next.js
- **HTTPS** : Recommandé en production

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- **Desktop** : Interface complète avec sidebar
- **Tablet** : Adaptation automatique des layouts
- **Mobile** : Navigation hamburger et composants adaptés

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres Plateformes
- **Netlify** : Compatible avec Next.js
- **Railway** : Support des bases de données
- **Heroku** : Configuration manuelle requise

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

## 🔄 Mises à Jour

### v1.0.0 (Actuel)
- ✅ Gestion complète des employés
- ✅ Système de congés avancé
- ✅ Analytics et rapports
- ✅ Interface moderne avec DaisyUI
- ✅ Authentification Clerk
- ✅ Base de données Prisma

### Prochaines Fonctionnalités
- 📅 Calendrier interactif
- 📧 Notifications par email
- 📱 Application mobile
- 🔄 Workflows automatisés
- 📊 Rapports avancés
- 🌐 Support multilingue étendu

---

**Développé avec ❤️ pour une gestion RH moderne et efficace**



