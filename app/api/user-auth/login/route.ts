// app/api/user-auth/login/route.ts
import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { loginRateLimiter } from '@/lib/rate-limiter';

// Define a Zod schema for the expected request body
const loginSchema = z.object({
  mobileNumber: z.string()
    .refine(val => /^\d{10}$/.test(val), {
      message: 'Mobile number must be a 10-digit number.',
    }),
});

// Change the type of req from 'Request' to 'NextRequest'
export async function POST(req: NextRequest) {
  // --- Rate Limiter Check ---
  const ipRateLimitResult = await loginRateLimiter.check(req);
  if (!ipRateLimitResult.success) {
    return NextResponse.json(
      { message: ipRateLimitResult.message, retryAfter: ipRateLimitResult.retryAfter },
      { status: 429 } // 429 Too Many Requests
    );
  }
  // --- End Rate Limiter Check ---

  try {
    const body = await req.json();

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Login API Validation Error:', validationResult.error.errors);
      return NextResponse.json(
        {
          message: 'Invalid input.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { mobileNumber } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { mobileNumber },
      select: {
        id: true,
        fullName: true,
        mobileNumber: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'No account found with this mobile number. Please sign up.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Login successful!',
      userId: user.id,
      fullName: user.fullName,
      mobileNumber: user.mobileNumber
    }, { status: 200 });

  } catch (error) {
    console.error('Login API caught an unexpected error:', error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json({ message: 'Invalid JSON in request body.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error. Please try again.' }, { status: 500 });
  }
}