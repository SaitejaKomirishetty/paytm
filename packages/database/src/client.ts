import net from 'node:net';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg'; // Import the Pool
import { PrismaClient } from "../generated/client";

// Node 20+ enables "Happy Eyeballs" (autoSelectFamily) by default and gives each
// resolved address only 250ms to connect before moving on. Neon hosts resolve to
// several IPv4/IPv6 addresses and can take ~2s to accept a connection (cold start +
// network distance), so the 250ms default exhausts every address and throws a
// message-less ETIMEDOUT. Give each attempt more time instead of disabling the
// dual-stack fallback (disabling risks a ~21s hang on a dead IPv6 first-address).
net.setDefaultAutoSelectFamilyAttemptTimeout?.(5000);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Create the Pool specifically for the adapter
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString
});

// 2. Pass the pool to the adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Optional: Log queries to see if connection works
    // log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "../generated/client";
