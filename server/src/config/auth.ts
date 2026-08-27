import prisma from "@/lib/prismaClient.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const baseUsername =
            ((user as Record<string, unknown>).username as string) ||
            user.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
          return {
            data: {
              ...user,
              username:
                ((user as Record<string, unknown>).username as string) ||
                `${baseUsername}-${uniqueSuffix}`,
            },
          };
        },
      },
    },
  },

  //   advanced: {
  //     database: {
  //       generateId: false,
  //     },
  //   },

  trustedOrigins: [process.env.FRONTEND_URL!],
});

export default auth;
