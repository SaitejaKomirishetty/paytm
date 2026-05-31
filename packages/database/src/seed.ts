import 'dotenv/config';
import bcrypt from "bcrypt";
import { prisma } from "./client";

import type { Prisma } from "../generated/client";

// All seeded users share this password; it is bcrypt-hashed before insert so
// they can log in through the NextAuth credentials provider (which compares
// against a bcrypt hash). Log in with the `number` below + this password.
const DEFAULT_PASSWORD = "password";

const DEFAULT_USERS = [
  // Add your own user to pre-populate the database with
  {
    name: "saiteja",
    email: "saiteja@gmail.com",
    number: "1111111111",
  },
  {
    name: "Harkirath",
    email: "harkirath@gmail.com",
    number: "2222222222",
  },
  {
    name: "Tim Apple",
    email: "tim@apple.com",
    number: "3333333333",
  },
] satisfies Array<Omit<Prisma.UserCreateInput, "password">>;

(async () => {
  try {
    const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email,
          },
          update: {
            ...user,
            password,
          },
          create: {
            ...user,
            password,
          },
        })
      )
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
