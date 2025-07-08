import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

// GET - Récupérer tous les postes
export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      include: { department: true },
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(positions);
  } catch (error) {
    console.error('Erreur lors de la récupération des postes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des postes' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau poste
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, level, status, departmentId } = body;
    const position = await prisma.position.create({
      data: {
        title,
        description,
        level,
        status,
        departmentId: departmentId ? Number(departmentId) : undefined,
      },
    });
    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du poste:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du poste' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un poste existant
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, level, status, departmentId } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }
    const position = await prisma.position.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        level,
        status,
        departmentId: departmentId ? Number(departmentId) : undefined,
      },
    });
    return NextResponse.json(position);
  } catch (error) {
    console.error('Erreur lors de la modification du poste:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du poste' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un poste
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }
    await prisma.position.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du poste:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du poste' },
      { status: 500 }
    );
  }
} 