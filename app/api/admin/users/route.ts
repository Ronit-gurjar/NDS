// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: 'Unauthorized: Not authenticated' }, { status: 401 });
    }

    const user = await getUser();

    // Retrieve ADMIN_USER_EMAILS from environment variables
    const adminEmailsString = process.env.ADMIN_USER_EMAILS;

    // IMPORTANT: Validate that the environment variable exists
    if (!adminEmailsString) {
      // Depending on your security policy, you might want to return a 500 error here
      // to prevent unintended access if misconfigured.
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // Split the comma-separated string into an array
    const ADMIN_EMAILS = adminEmailsString.split(',').map(email => email.trim());

    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ message: 'Forbidden: Not an authorized admin' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        mobileNumber: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error('Error fetching users:', error);

    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json({ message: 'Failed to fetch users', error: errorMessage }, { status: 500 });
  }
}