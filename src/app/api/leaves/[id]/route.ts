import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../src/lib/prisma';

// GET - Récupérer une demande de congé spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: params.id },
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

    if (!leave) {
      return NextResponse.json(
        { error: 'Demande de congé non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(leave);
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande de congé:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la demande de congé' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une demande de congé (approbation/rejet)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, moderatorId, moderatorNote } = body;

    // Validation
    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Status invalide. Doit être APPROVED, REJECTED ou PENDING' },
        { status: 400 }
      );
    }

    // Récupérer la demande de congé existante
    const existingLeave = await prisma.leave.findUnique({
      where: { id: params.id },
      include: {
        leaveType: true
      }
    });

    if (!existingLeave) {
      return NextResponse.json(
        { error: 'Demande de congé non trouvée' },
        { status: 404 }
      );
    }

    // Si la demande est approuvée, déduire du solde
    if (status === 'APPROVED' && existingLeave.status !== 'APPROVED') {
      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: {
          userId_leaveTypeId: {
            userId: existingLeave.userId,
            leaveTypeId: existingLeave.leaveTypeId
          }
        }
      });

      if (leaveBalance && leaveBalance.balance >= existingLeave.days) {
        // Mettre à jour le solde
        await prisma.leaveBalance.update({
          where: {
            userId_leaveTypeId: {
              userId: existingLeave.userId,
              leaveTypeId: existingLeave.leaveTypeId
            }
          },
          data: {
            balance: leaveBalance.balance - existingLeave.days
          }
        });
      } else {
        return NextResponse.json(
          { error: 'Solde insuffisant pour approuver cette demande' },
          { status: 400 }
        );
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      status,
      moderatorNote
    };

    // Ajouter moderatorId seulement s'il est fourni et valide
    if (moderatorId) {
      // Vérifier que l'utilisateur modérateur existe
      const moderator = await prisma.user.findUnique({
        where: { id: moderatorId }
      });
      
      if (moderator) {
        updateData.moderatorId = moderatorId;
      } else {
        console.warn(`Modérateur avec l'ID ${moderatorId} non trouvé, mise à jour sans modérateur`);
      }
    }

    // Mettre à jour la demande de congé
    const updatedLeave = await prisma.leave.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedLeave);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande de congé:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la demande de congé' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une demande de congé
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: params.id }
    });

    if (!leave) {
      return NextResponse.json(
        { error: 'Demande de congé non trouvée' },
        { status: 404 }
      );
    }

    // Si la demande était approuvée, rembourser le solde
    if (leave.status === 'APPROVED') {
      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: {
          userId_leaveTypeId: {
            userId: leave.userId,
            leaveTypeId: leave.leaveTypeId
          }
        }
      });

      if (leaveBalance) {
        await prisma.leaveBalance.update({
          where: {
            userId_leaveTypeId: {
              userId: leave.userId,
              leaveTypeId: leave.leaveTypeId
            }
          },
          data: {
            balance: leaveBalance.balance + leave.days
          }
        });
      }
    }

    // Supprimer la demande de congé
    await prisma.leave.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande de congé:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la demande de congé' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le statut d'une demande de congé
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log('Mise à jour de la demande:', id, body);
    
    // Validation des données
    if (!body.status) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    // Vérifier que la demande existe
    const existingLeave = await prisma.leave.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        leaveType: true
      }
    });

    if (!existingLeave) {
      return NextResponse.json(
        { error: 'Demande de congé non trouvée' },
        { status: 404 }
      );
    }

    // Si la demande est approuvée, vérifier et déduire du solde
    if (body.status === 'APPROVED') {
      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: {
          userId_leaveTypeId: {
            userId: existingLeave.userId,
            leaveTypeId: existingLeave.leaveTypeId
          }
        }
      });

      if (!leaveBalance || leaveBalance.balance < existingLeave.days) {
        return NextResponse.json(
          { error: 'Solde insuffisant pour approuver cette demande' },
          { status: 400 }
        );
      }

      // Déduire du solde
      await prisma.leaveBalance.update({
        where: {
          userId_leaveTypeId: {
            userId: existingLeave.userId,
            leaveTypeId: existingLeave.leaveTypeId
          }
        },
        data: {
          balance: {
            decrement: existingLeave.days
          }
        }
      });
    }

    // Mettre à jour la demande
    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: {
        status: body.status,
        moderatorNote: body.moderatorNote || null,
        moderatorId: body.moderatorId || null, // À remplacer par l'ID de l'utilisateur connecté
        updatedAt: new Date()
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

    console.log('Demande mise à jour avec succès:', updatedLeave);
    return NextResponse.json({ success: true, leave: updatedLeave });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la demande' },
      { status: 500 }
    );
  }
} 