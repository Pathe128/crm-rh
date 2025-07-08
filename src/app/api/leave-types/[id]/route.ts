import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../src/lib/prisma';

// GET - Récupérer un type de congé par ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const leaveType = await prisma.leaveType.findUnique({
      where: { id: Number(params.id) },
    });
    if (!leaveType) {
      return NextResponse.json({ error: 'Type de congé non trouvé' }, { status: 404 });
    }
    return NextResponse.json(leaveType);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Modifier un type de congé
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const leaveType = await prisma.leaveType.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(leaveType);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE - Supprimer un type de congé
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.leaveType.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
} 