const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function migrateSchema() {
  try {
    console.log('🔄 Début de la migration du schéma...');

    // 1. Créer les types de congés par défaut
    console.log('📝 Création des types de congés par défaut...');
    
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

    console.log('✅ Types de congés créés avec succès');

    // 2. Récupérer tous les utilisateurs
    console.log('👥 Récupération des utilisateurs...');
    const users = await prisma.user.findMany();
    console.log(`✅ ${users.length} utilisateurs trouvés`);

    // 3. Créer les soldes de congés pour chaque utilisateur
    console.log('💰 Création des soldes de congés...');
    const allLeaveTypes = await prisma.leaveType.findMany();
    
    for (const user of users) {
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

    console.log('✅ Soldes de congés créés avec succès');

    // 4. Mettre à jour les congés existants
    console.log('📅 Mise à jour des congés existants...');
    const leaves = await prisma.leave.findMany();
    
    // Trouver le type de congé annuel par défaut
    const annualLeaveType = await prisma.leaveType.findFirst({
      where: { name: 'Congé annuel payé' }
    });

    for (const leave of leaves) {
      await prisma.leave.update({
        where: { id: leave.id },
        data: {
          leaveTypeId: annualLeaveType.id
        }
      });
    }

    console.log(`✅ ${leaves.length} congés mis à jour`);

    console.log('🎉 Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateSchema(); 