// app/api/user-auth/signup/route.ts
import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { prisma } from '@/lib/prisma';
import { signupRateLimiter } from '@/lib/rate-limiter';
import { z } from 'zod';

// Define a Zod schema for the expected request body for signup
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long."),
  mobileNumber: z.string()
    .refine(val => /^\d{10}$/.test(val), {
      message: 'Mobile number must be a 10-digit number.',
    }),
});

// Change the type of req from 'Request' to 'NextRequest'
export async function POST(req: NextRequest) {
  // --- Rate Limiter Check ---
  const ipRateLimitResult = await signupRateLimiter.check(req);
  if (!ipRateLimitResult.success) {
    return NextResponse.json(
      { message: ipRateLimitResult.message, retryAfter: ipRateLimitResult.retryAfter },
      { status: 429 } // 429 Too Many Requests
    );
  }
  // --- End Rate Limiter Check ---

  try {
    const body = await req.json();

    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Signup API Validation Error:', validationResult.error.errors);
      return NextResponse.json(
        {
          message: 'Invalid input.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, mobileNumber } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobileNumber },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Account with this mobile number already exists.' }, { status: 409 });
    }

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        fullName,
        mobileNumber,
        isVerified: true, // User is considered verified upon successful signup
      },
    });

    return NextResponse.json({ message: 'Signup successful!', userId: newUser.id }, { status: 200 });
  } catch (error) {
    console.error('Signup API error:', error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return NextResponse.json({ message: 'Invalid JSON in request body.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Something went wrong during signup.' }, { status: 500 });
  }
}