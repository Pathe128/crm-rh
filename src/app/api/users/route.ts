import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';
import bcrypt from 'bcrypt';

// GET - Récupérer tous les utilisateurs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (departmentId) {
      whereClause.departmentId = parseInt(departmentId);
    }
    
    if (role) {
      whereClause.role = role;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        leaveBalances: {
          include: {
            leaveType: {
              select: {
                id: true,
                name: true,
                annualQuota: true
              }
            }
          }
        },
        leaves: {
          where: {
            status: 'APPROVED'
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            days: true,
            leaveType: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Données reçues dans l\'API:', body);
    
    // Validation des données
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Données manquantes: firstName, lastName, email, password sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Conversion des types enum
    const employmentTypeMap: { [key: string]: string } = {
      'CDI': 'CDI',
      'CDD': 'CDD', 
      'consultant': 'consultant',
      'stage': 'stage'
    };

    const roleMap: { [key: string]: string } = {
      'ADMIN': 'ADMIN',
      'RH': 'RH',
      'MANAGER': 'MANAGER',
      'EMPLOYEE': 'EMPLOYEE'
    };

    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'ACTIVE',
      'INACTIVE': 'INACTIVE'
    };

    const employmentType = employmentTypeMap[body.employmentType] || 'CDI';
    const role = roleMap[body.role] || 'EMPLOYEE';
    const status = statusMap[body.status] || 'ACTIVE';

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        phoneNumber: body.phoneNumber || '',
        address: body.address || '',
        startDate: new Date(body.startDate || Date.now()),
        endDate: body.endDate ? new Date(body.endDate) : new Date('2099-12-31'),
        jobTitle: body.jobTitle || '',
        departmentId: body.departmentId ? parseInt(body.departmentId) : null,
        employmentType: employmentType as any,
        salaireBrut: parseFloat(body.salaireBrut) || 0,
        status: status as any,
        photo: body.photo || null,
        role: role as any,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    // Créer les soldes de congés pour le nouvel utilisateur
    const leaveTypes = await prisma.leaveType.findMany();
    for (const leaveType of leaveTypes) {
      await prisma.leaveBalance.create({
        data: {
          userId: user.id,
          leaveTypeId: leaveType.id,
          balance: leaveType.annualQuota
        }
      });
    }

    console.log('Utilisateur créé avec succès:', user);
    return NextResponse.json({ success: true, user }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
} 