const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addLeaveBalances() {
  try {
    console.log('🚀 Ajout des soldes de congés...');

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      include: {
        department: true
      }
    });

    // Récupérer tous les types de congés
    const leaveTypes = await prisma.leaveType.findMany();

    console.log(`📊 ${users.length} utilisateurs trouvés`);
    console.log(`📋 ${leaveTypes.length} types de congés trouvés`);

    // Créer des soldes pour chaque utilisateur et type de congé
    const balances = [];
    
    for (const user of users) {
      for (const leaveType of leaveTypes) {
        // Vérifier si le solde existe déjà
        const existingBalance = await prisma.leaveBalance.findUnique({
          where: {
            userId_leaveTypeId: {
              userId: user.id,
              leaveTypeId: leaveType.id
            }
          }
        });

        if (!existingBalance) {
          // Créer un nouveau solde avec des valeurs par défaut
          let defaultBalance = 25; // Congés payés par défaut
          
          if (leaveType.name.toLowerCase().includes('maladie')) {
            defaultBalance = 15; // Congés maladie
          } else if (leaveType.name.toLowerCase().includes('rtt')) {
            defaultBalance = 10; // RTT
          } else if (leaveType.name.toLowerCase().includes('formation')) {
            defaultBalance = 5; // Formation
          }

          balances.push({
            userId: user.id,
            leaveTypeId: leaveType.id,
            year: new Date().getFullYear().toString(),
            balance: defaultBalance,
            used: 0
          });
        }
      }
    }

    if (balances.length > 0) {
      // Insérer tous les soldes
      const createdBalances = await prisma.leaveBalance.createMany({
        data: balances,
        skipDuplicates: true
      });

      console.log(`✅ ${createdBalances.count} soldes de congés créés`);
    } else {
      console.log('ℹ️ Tous les soldes existent déjà');
    }

    // Afficher un résumé
    const allBalances = await prisma.leaveBalance.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        leaveType: {
          select: {
            name: true
          }
        }
      }
    });

    console.log('\n📋 Résumé des soldes :');
    console.log('='.repeat(80));
    
    for (const balance of allBalances) {
      console.log(
        `${balance.user.firstName} ${balance.user.lastName} - ` +
        `${balance.leaveType.name}: ${balance.balance} jours (utilisé: ${balance.used})`
      );
    }

    console.log('\n🎉 Script terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
addLeaveBalances(); 