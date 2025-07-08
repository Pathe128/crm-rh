import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

// GET - Récupérer tous les types de congés
export async function GET() {
  try {
    const leaveTypes = await prisma.leaveType.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(leaveTypes);
  } catch (error) {
    console.error('Erreur lors de la récupération des types de congés:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des types de congés' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau type de congé
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, annualQuota, remuneration } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom du type de congé est requis' },
        { status: 400 }
      );
    }

    if (annualQuota === undefined || annualQuota < 0) {
      return NextResponse.json(
        { error: 'Le quota annuel doit être un nombre positif' },
        { status: 400 }
      );
    }

    // Vérifier si le type existe déjà
    const existingLeaveType = await prisma.leaveType.findUnique({
      where: { name }
    });

    if (existingLeaveType) {
      return NextResponse.json(
        { error: 'Un type de congé avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    // Créer le type de congé
    const leaveType = await prisma.leaveType.create({
      data: {
        name,
        description,
        annualQuota: parseInt(annualQuota),
        remuneration: remuneration ?? false
      }
    });

    return NextResponse.json(leaveType, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du type de congé:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du type de congé' },
      { status: 500 }
    );
  }
} 