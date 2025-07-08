import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

// GET - Récupérer toutes les demandes de congés
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const leaves = await prisma.leave.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: {
              select: {
                name: true
              }
            }
          }
        },
        leaveType: true,
        moderator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Erreur lors de la récupération des congés:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des congés' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle demande de congé
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Création de congé avec les données:', body);
    
    // Validation des données
    if (!body.userId || !body.startDate || !body.endDate || !body.leaveTypeId) {
      return NextResponse.json(
        { error: 'Données manquantes: userId, startDate, endDate, leaveTypeId sont requis' },
        { status: 400 }
      );
    }

    // Calculer le nombre de jours
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
      select: { 
        firstName: true, 
        lastName: true, 
        email: true,
        department: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le type de congé existe
    const leaveType = await prisma.leaveType.findUnique({
      where: { id: body.leaveTypeId }
    });

    if (!leaveType) {
      return NextResponse.json(
        { error: 'Type de congé non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le solde disponible
    const leaveBalance = await prisma.leaveBalance.findUnique({
      where: {
        userId_leaveTypeId: {
          userId: body.userId,
          leaveTypeId: body.leaveTypeId
        }
      }
    });

    if (!leaveBalance || leaveBalance.balance < days) {
      return NextResponse.json(
        { error: 'Solde insuffisant pour ce type de congé' },
        { status: 400 }
      );
    }

    // Créer la demande de congé
    const leave = await prisma.leave.create({
      data: {
        userId: body.userId,
        leaveTypeId: body.leaveTypeId,
        year: new Date().getFullYear().toString(),
        startDate: startDate,
        endDate: endDate,
        days: days,
        userName: `${user.firstName} ${user.lastName}`,
        userNote: body.userNote || '',
        userEmail: user.email,
        status: body.status || 'PENDING',
        moderatorId: body.moderatorId || null,
        moderatorNote: body.moderatorNote || null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: {
              select: {
                name: true
              }
            }
          }
        },
        leaveType: true,
        moderator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    console.log('Congé créé avec succès:', leave);
    return NextResponse.json({ success: true, leave }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création du congé:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du congé' },
      { status: 500 }
    );
  }
} 