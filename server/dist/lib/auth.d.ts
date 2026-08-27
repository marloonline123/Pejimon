declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
    };
    user: {
        additionalFields: {
            username: {
                type: "string";
                required: false;
                input: true;
            };
        };
    };
    databaseHooks: {
        user: {
            create: {
                before: (user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, unknown>) => Promise<{
                    data: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                        username: string;
                    };
                }>;
            };
        };
    };
    trustedOrigins: string[];
}>;
export default auth;
//# sourceMappingURL=auth.d.ts.map