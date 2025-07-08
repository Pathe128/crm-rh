const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // 1. Créer les départements
  console.log('🏢 Création des départements...');
  const departments = [
    {
      name: 'Direction',
      description: 'Direction générale de l\'entreprise'
    },
    {
      name: 'Ressources Humaines',
      description: 'Gestion des ressources humaines'
    },
    {
      name: 'Développement',
      description: 'Équipe de développement informatique'
    },
    {
      name: 'Marketing',
      description: 'Équipe marketing et communication'
    },
    {
      name: 'Finance',
      description: 'Gestion financière et comptabilité'
    }
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept
    });
  }
  console.log('✅ Départements créés');

  // 2. Créer les types de congés
  console.log('📅 Création des types de congés...');
  const leaveTypes = [
    {
      name: 'Congé annuel payé',
      description: 'Congé annuel standard',
      annualQuota: 18,
      remuneration: true
    },
    {
      name: 'Congé maladie',
      description: 'Congé pour maladie',
      annualQuota: 180,
      remuneration: true
    },
    {
      name: 'Congé maternité',
      description: 'Congé de maternité',
      annualQuota: 98,
      remuneration: true
    },
    {
      name: 'Congé paternité',
      description: 'Congé de paternité',
      annualQuota: 3,
      remuneration: true
    },
    {
      name: 'Mariage salarié',
      description: 'Congé pour mariage du salarié',
      annualQuota: 4,
      remuneration: true
    },
    {
      name: 'Mariage enfant',
      description: 'Congé pour mariage d\'un enfant',
      annualQuota: 2,
      remuneration: true
    },
    {
      name: 'Décès (parent proche)',
      description: 'Congé de deuil pour parent proche',
      annualQuota: 3,
      remuneration: true
    },
    {
      name: 'Congé sans solde',
      description: 'Congé non rémunéré',
      annualQuota: 0,
      remuneration: false
    }
  ];

  for (const leaveType of leaveTypes) {
    await prisma.leaveType.upsert({
      where: { name: leaveType.name },
      update: {},
      create: leaveType
    });
  }
  console.log('✅ Types de congés créés');

  // 3. Créer les utilisateurs de test
  console.log('👥 Création des utilisateurs de test...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      firstName: 'Admin',
      lastName: 'Principal',
      email: 'admin@example.com',
      password: hashedPassword,
      phoneNumber: '0123456789',
      address: '123 Rue Admin, Ville',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2025-12-31'),
      jobTitle: 'Administrateur Principal',
      employmentType: 'CDI',
      salaireBrut: 5000,
      status: 'ACTIVE',
      role: 'ADMIN',
      departmentId: 1 // Direction
    },
    {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@example.com',
      password: hashedPassword,
      phoneNumber: '0123456790',
      address: '456 Rue Marie, Ville',
      startDate: new Date('2023-03-15'),
      endDate: new Date('2025-12-31'),
      jobTitle: 'Responsable RH',
      employmentType: 'CDI',
      salaireBrut: 3500,
      status: 'ACTIVE',
      role: 'RH',
      departmentId: 2 // RH
    },
    {
      firstName: 'Jean',
      lastName: 'Martin',
      email: 'jean.martin@example.com',
      password: hashedPassword,
      phoneNumber: '0123456791',
      address: '789 Rue Jean, Ville',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2025-12-31'),
      jobTitle: 'Développeur Senior',
      employmentType: 'CDI',
      salaireBrut: 4000,
      status: 'ACTIVE',
      role: 'EMPLOYEE',
      departmentId: 3 // Développement
    },
    {
      firstName: 'Sophie',
      lastName: 'Laurent',
      email: 'sophie.laurent@example.com',
      password: hashedPassword,
      phoneNumber: '0123456792',
      address: '321 Rue Sophie, Ville',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2025-12-31'),
      jobTitle: 'Chef de Projet',
      employmentType: 'CDI',
      salaireBrut: 3800,
      status: 'ACTIVE',
      role: 'MANAGER',
      departmentId: 3 // Développement
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }
  console.log('✅ Utilisateurs créés');

  // 4. Créer les soldes de congés pour chaque utilisateur
  console.log('💰 Création des soldes de congés...');
  const allUsers = await prisma.user.findMany();
  const allLeaveTypes = await prisma.leaveType.findMany();

  for (const user of allUsers) {
    for (const leaveType of allLeaveTypes) {
      await prisma.leaveBalance.upsert({
        where: {
          userId_leaveTypeId: {
            userId: user.id,
            leaveTypeId: leaveType.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          leaveTypeId: leaveType.id,
          balance: leaveType.annualQuota
        }
      });
    }
  }
  console.log('✅ Soldes de congés créés');

  // 5. Créer quelques demandes de congés de test
  console.log('📋 Création de demandes de congés de test...');
  const annualLeaveType = await prisma.leaveType.findFirst({
    where: { name: 'Congé annuel payé' }
  });

  const testLeaves = [
    {
      leaveTypeId: annualLeaveType.id,
      year: '2024',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-07-19'),
      days: 5,
      userName: 'Jean Martin',
      userNote: 'Vacances d\'été',
      userEmail: 'jean.martin@example.com',
      status: 'APPROVED',
      userId: (await prisma.user.findFirst({ where: { email: 'jean.martin@example.com' } })).id,
      moderatorId: (await prisma.user.findFirst({ where: { email: 'sophie.laurent@example.com' } })).id
    },
    {
      leaveTypeId: annualLeaveType.id,
      year: '2024',
      startDate: new Date('2024-08-05'),
      endDate: new Date('2024-08-09'),
      days: 5,
      userName: 'Marie Dupont',
      userNote: 'Vacances familiales',
      userEmail: 'marie.dupont@example.com',
      status: 'PENDING',
      userId: (await prisma.user.findFirst({ where: { email: 'marie.dupont@example.com' } })).id
    }
  ];

  for (const leave of testLeaves) {
    await prisma.leave.create({
      data: leave
    });
  }
  console.log('✅ Demandes de congés créées');

  console.log('🎉 Seeding terminé avec succès !');
  console.log('\n📊 Résumé :');
  console.log(`- ${departments.length} départements créés`);
  console.log(`- ${leaveTypes.length} types de congés créés`);
  console.log(`- ${users.length} utilisateurs créés`);
  console.log(`- ${testLeaves.length} demandes de congés créées`);
  console.log('\n🔑 Identifiants de connexion :');
  console.log('- admin@example.com / password123');
  console.log('- marie.dupont@example.com / password123');
  console.log('- jean.martin@example.com / password123');
  console.log('- sophie.laurent@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 