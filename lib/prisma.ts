// lib/prisma.ts

// Change this import:
// import { PrismaClient } from '@prisma/client'

// To this, to point to your *generated* client:
// Assuming lib/prisma.ts is in lib/, then ../lib/generated/prisma is relative to the project root.
// If lib/prisma.ts is in app/lib/, it would be ../../lib/generated/prisma
// Let's assume lib/prisma.ts is directly under your project root's 'lib' directory.

import { PrismaClient } from './generated/prisma'; // This path is relative from lib/prisma.ts to lib/generated/prisma

// If you also need the general Prisma namespace for types within lib/prisma.ts,
// you would import it like this as well:
// import { Prisma } from './generated/prisma';


declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;