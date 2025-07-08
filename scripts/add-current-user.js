const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCurrentUser() {
  try {
    console.log('🚀 Ajout de l\'utilisateur connecté...');
    
    // Remplacez par votre email Clerk
    const userEmail = 'votre-email@example.com'; // À MODIFIER
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (existingUser) {
      console.log('✅ Utilisateur déjà existant:', existingUser.firstName, existingUser.lastName);
      return;
    }

    // Récupérer le premier département pour l'assigner
    const department = await prisma.department.findFirst();
    
    if (!department) {
      console.log('❌ Aucun département trouvé. Créez d\'abord des départements.');
      return;
    }

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        firstName: 'Utilisateur',
        lastName: 'Connecté',
        email: userEmail,
        jobTitle: 'Employé',
        phone: '+33123456789',
        address: '123 Rue de la Paix, 75001 Paris',
        hireDate: new Date(),
        salary: 35000,
        departmentId: department.id,
        role: 'EMPLOYEE'
      }
    });

    console.log('✅ Utilisateur créé avec succès:', newUser.firstName, newUser.lastName);
    console.log('📧 Email:', newUser.email);
    console.log('🏢 Département:', department.name);

    // Créer les soldes de congés pour cet utilisateur
    const leaveTypes = await prisma.leaveType.findMany();
    
    for (const leaveType of leaveTypes) {
      let defaultBalance = 25; // Congés payés par défaut
      
      if (leaveType.name.toLowerCase().includes('maladie')) {
        defaultBalance = 15;
      } else if (leaveType.name.toLowerCase().includes('rtt')) {
        defaultBalance = 10;
      } else if (leaveType.name.toLowerCase().includes('formation')) {
        defaultBalance = 5;
      }

      await prisma.leaveBalance.create({
        data: {
          userId: newUser.id,
          leaveTypeId: leaveType.id,
          year: new Date().getFullYear().toString(),
          balance: defaultBalance,
          used: 0
        }
      });
    }

    console.log('✅ Soldes de congés créés pour tous les types');

    console.log('\n🎉 Configuration terminée !');
    console.log('Vous pouvez maintenant accéder aux pages :');
    console.log('- /workspace/leave-management/my-requests');
    console.log('- /workspace/leave-management/new-request');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Instructions
console.log('📝 INSTRUCTIONS :');
console.log('1. Remplacez "votre-email@example.com" par votre email Clerk');
console.log('2. Sauvegardez le fichier');
console.log('3. Exécutez : node scripts/add-current-user.js');
console.log('');

// Exécuter le script
addCurrentUser(); 