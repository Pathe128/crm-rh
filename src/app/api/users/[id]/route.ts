import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    console.log('Récupération de l\'utilisateur:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Utilisateur récupéré avec succès:', user);
    return NextResponse.json(user);
    
  } catch (error: any) {
    console.error('Erreur lors de la récupération:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: userId }
    });
    
    console.log('Utilisateur supprimé avec succès:', userId);
    return NextResponse.json({ success: true, message: 'Utilisateur supprimé' });
    
  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    
    console.log('Modification de l\'utilisateur:', userId, body);
    
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Validation des données
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: 'Données manquantes: firstName, lastName, email sont requis' },
        { status: 400 }
      );
    }

    // Conversion des types enum
    const employmentTypeMap: { [key: string]: string } = {
      'CDI': 'CDI',
      'CDD': 'CDD', 
      'consultant': 'consultant',
      'stage': 'stage'
    };

    const roleMap: { [key: string]: string } = {
      'ADMIN': 'ADMIN',
      'EMPLOYEE': 'EMPLOYEE',
      'USER': 'USER'
    };

    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'ACTIVE',
      'INACTIVE': 'INACTIVE'
    };

    const employmentType = employmentTypeMap[body.employmentType] || 'CDI';
    const role = roleMap[body.role] || 'EMPLOYEE';
    const status = statusMap[body.status] || 'ACTIVE';

    // Préparer les données de mise à jour
    const updateData: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      address: body.address,
      startDate: new Date(body.startDate),
      jobTitle: body.jobTitle,
      departmentId: body.departmentId || null,
      employmentType: employmentType as any,
      salaireBrut: body.salaireBrut,
      status: status as any,
      role: role as any,
    };

    // Ajouter endDate seulement si fourni
    if (body.endDate) {
      updateData.endDate = new Date(body.endDate);
    }

    // Ajouter photo seulement si fournie
    if (body.photo) {
      updateData.photo = body.photo;
    }

    // Ajouter password seulement si fourni
    if (body.password) {
      updateData.password = body.password;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        department: true,
      }
    });

    console.log('Utilisateur modifié avec succès:', updatedUser);
    return NextResponse.json({ success: true, user: updatedUser });
    
  } catch (error: any) {
    console.error('Erreur lors de la modification:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la modification de l\'utilisateur' },
      { status: 500 }
    );
  }
} 