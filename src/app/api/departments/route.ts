import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

// GET - Récupérer tous les départements
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            jobTitle: true,
            status: true
          }
        },
        head: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Erreur lors de la récupération des départements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des départements' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau département
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, headId } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom du département est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le département existe déjà
    const existingDepartment = await prisma.department.findUnique({
      where: { name }
    });

    if (existingDepartment) {
      return NextResponse.json(
        { error: 'Un département avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    // Créer le département
    const department = await prisma.department.create({
      data: {
        name,
        description,
        headId
      },
      include: {
        head: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du département:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du département' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un département
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, headId } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }
    const updatedDepartment = await prisma.department.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        headId
      },
      include: {
        head: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error('Erreur lors de la modification du département:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du département' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un département
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }
    await prisma.department.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du département:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du département' },
      { status: 500 }
    );
  }
} 