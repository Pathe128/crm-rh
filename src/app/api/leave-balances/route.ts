import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

// GET - Récupérer tous les soldes de congés
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Récupérer les soldes d'un utilisateur spécifique
      const balances = await prisma.leaveBalance.findMany({
        where: { userId },
        include: {
          leaveType: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
      return NextResponse.json(balances);
    }

    // Récupérer tous les soldes
    const balances = await prisma.leaveBalance.findMany({
      include: {
        leaveType: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(balances);
  } catch (error) {
    console.error('Erreur lors de la récupération des soldes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des soldes' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour un solde
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, leaveTypeId, balance } = body;

    // Validation
    if (!userId || !leaveTypeId || balance === undefined) {
      return NextResponse.json(
        { error: 'userId, leaveTypeId et balance sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur et le type de congé existent
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const leaveType = await prisma.leaveType.findUnique({ where: { id: leaveTypeId } });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (!leaveType) {
      return NextResponse.json(
        { error: 'Type de congé non trouvé' },
        { status: 404 }
      );
    }

    // Créer ou mettre à jour le solde
    const leaveBalance = await prisma.leaveBalance.upsert({
      where: {
        userId_leaveTypeId: {
          userId,
          leaveTypeId
        }
      },
      update: {
        balance: parseInt(balance)
      },
      create: {
        userId,
        leaveTypeId,
        balance: parseInt(balance)
      },
      include: {
        leaveType: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(leaveBalance, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour du solde:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création/mise à jour du solde' },
      { status: 500 }
    );
  }
} 