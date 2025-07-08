import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        department: true
      }
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Récupérer le premier département disponible
    const department = await prisma.department.findFirst();
    
    if (!department) {
      return NextResponse.json(
        { error: 'Aucun département disponible. Créez d\'abord des départements.' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName || 'Utilisateur',
        lastName: lastName || 'Connecté',
        email: email,
        jobTitle: 'Employé',
        phone: '+33123456789',
        address: '123 Rue de la Paix, 75001 Paris',
        hireDate: new Date(),
        salary: 35000,
        departmentId: department.id,
        role: 'EMPLOYEE',
        status: 'ACTIVE'
      },
      include: {
        department: true
      }
    });

    // Créer les soldes de congés pour cet utilisateur
    const leaveTypes = await prisma.leaveType.findMany();
    
    for (const leaveType of leaveTypes) {
      let defaultBalance = 25; // Congés payés par défaut
      
      if (leaveType.name.toLowerCase().includes('maladie')) {
        defaultBalance = 15;
      } else if (leaveType.name.toLowerCase().includes('rtt')) {
        defaultBalance = 10;
      } else if (leaveType.name.toLowerCase().includes('formation')) {
        defaultBalance = 5;
      }

      await prisma.leaveBalance.create({
        data: {
          userId: newUser.id,
          leaveTypeId: leaveType.id,
          year: new Date().getFullYear().toString(),
          balance: defaultBalance,
          used: 0
        }
      });
    }

    console.log('✅ Utilisateur créé automatiquement:', newUser.email);
    return NextResponse.json(newUser);

  } catch (error) {
    console.error('Erreur lors de la création automatique:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
} 