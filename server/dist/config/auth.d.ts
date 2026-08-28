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
                after: (user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, unknown>) => Promise<void>;
            };
        };
        team: {
            create: {
                before: (team: any) => Promise<{
                    data: any;
                }>;
            };
        };
    };
    trustedOrigins: string[];
    plugins: [{
        id: "organization";
        version: string;
        endpoints: import("better-auth/plugins").OrganizationEndpoints<{
            schema: {
                organization: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        updatedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                team: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        slug: {
                            type: "string";
                            required: true;
                            input: true;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
            };
            teams: {
                enabled: false;
            };
            ac: {
                newRole<const TRoleStatements extends import("better-auth/plugins").Statements>(statements: import("better-auth/plugins").RoleInput<{
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }, TRoleStatements>): import("better-auth/plugins").Role<import("better-auth/plugins").ExactRoleStatements<TRoleStatements>, {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }>;
                statements: {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                };
            };
            dynamicAccessControl: {
                enabled: true;
            };
        }> & import("better-auth/plugins").DynamicAccessControlEndpoints<{
            schema: {
                organization: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        updatedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                team: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        slug: {
                            type: "string";
                            required: true;
                            input: true;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
            };
            teams: {
                enabled: false;
            };
            ac: {
                newRole<const TRoleStatements extends import("better-auth/plugins").Statements>(statements: import("better-auth/plugins").RoleInput<{
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }, TRoleStatements>): import("better-auth/plugins").Role<import("better-auth/plugins").ExactRoleStatements<TRoleStatements>, {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }>;
                statements: {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                };
            };
            dynamicAccessControl: {
                enabled: true;
            };
        }>;
        schema: import("better-auth/plugins").OrganizationSchema<{
            schema: {
                organization: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        updatedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                team: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        slug: {
                            type: "string";
                            required: true;
                            input: true;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
            };
            teams: {
                enabled: false;
            };
            ac: {
                newRole<const TRoleStatements extends import("better-auth/plugins").Statements>(statements: import("better-auth/plugins").RoleInput<{
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }, TRoleStatements>): import("better-auth/plugins").Role<import("better-auth/plugins").ExactRoleStatements<TRoleStatements>, {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }>;
                statements: {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                };
            };
            dynamicAccessControl: {
                enabled: true;
            };
        }>;
        $Infer: {
            Organization: {
                id: string;
                name: string;
                slug: string;
                logo?: string | null | undefined;
                metadata?: any;
                createdAt: Date;
                description?: string;
                updatedAt?: Date;
                deletedAt?: Date;
            };
            Invitation: {
                id: string;
                organizationId: string;
                email: string;
                role: "admin" | "member" | "owner";
                status: import("better-auth/plugins").InvitationStatus;
                inviterId: string;
                expiresAt: Date;
                createdAt: Date;
            };
            Member: {
                id: string;
                organizationId: string;
                role: "admin" | "member" | "owner";
                createdAt: Date;
                userId: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                };
            };
            Team: never;
            TeamMember: never;
            ActiveOrganization: {
                members: {
                    id: string;
                    organizationId: string;
                    role: "admin" | "member" | "owner";
                    createdAt: Date;
                    userId: string;
                    user: {
                        id: string;
                        email: string;
                        name: string;
                        image?: string | undefined;
                    };
                }[];
                invitations: {
                    id: string;
                    organizationId: string;
                    email: string;
                    role: "admin" | "member" | "owner";
                    status: import("better-auth/plugins").InvitationStatus;
                    inviterId: string;
                    expiresAt: Date;
                    createdAt: Date;
                }[];
            } & {
                id: string;
                name: string;
                slug: string;
                logo?: string | null | undefined;
                metadata?: any;
                createdAt: Date;
                description?: string;
                updatedAt?: Date;
                deletedAt?: Date;
            };
        };
        $ERROR_CODES: {
            YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION">;
            YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: import("better-auth").RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS">;
            ORGANIZATION_ALREADY_EXISTS: import("better-auth").RawError<"ORGANIZATION_ALREADY_EXISTS">;
            ORGANIZATION_SLUG_ALREADY_TAKEN: import("better-auth").RawError<"ORGANIZATION_SLUG_ALREADY_TAKEN">;
            ORGANIZATION_NOT_FOUND: import("better-auth").RawError<"ORGANIZATION_NOT_FOUND">;
            USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: import("better-auth").RawError<"USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION">;
            YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION">;
            YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION">;
            NO_ACTIVE_ORGANIZATION: import("better-auth").RawError<"NO_ACTIVE_ORGANIZATION">;
            USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: import("better-auth").RawError<"USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION">;
            MEMBER_NOT_FOUND: import("better-auth").RawError<"MEMBER_NOT_FOUND">;
            ROLE_NOT_FOUND: import("better-auth").RawError<"ROLE_NOT_FOUND">;
            YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM">;
            TEAM_ALREADY_EXISTS: import("better-auth").RawError<"TEAM_ALREADY_EXISTS">;
            TEAM_NOT_FOUND: import("better-auth").RawError<"TEAM_NOT_FOUND">;
            YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: import("better-auth").RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER">;
            YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: import("better-auth").RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER">;
            YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER">;
            YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION">;
            USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: import("better-auth").RawError<"USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION">;
            INVITATION_NOT_FOUND: import("better-auth").RawError<"INVITATION_NOT_FOUND">;
            YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: import("better-auth").RawError<"YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION">;
            EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: import("better-auth").RawError<"EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION">;
            EMAIL_VERIFICATION_REQUIRED_FOR_INVITATION: import("better-auth").RawError<"EMAIL_VERIFICATION_REQUIRED_FOR_INVITATION">;
            YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION">;
            INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: import("better-auth").RawError<"INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION">;
            YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE">;
            FAILED_TO_RETRIEVE_INVITATION: import("better-auth").RawError<"FAILED_TO_RETRIEVE_INVITATION">;
            YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: import("better-auth").RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS">;
            UNABLE_TO_REMOVE_LAST_TEAM: import("better-auth").RawError<"UNABLE_TO_REMOVE_LAST_TEAM">;
            YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER">;
            ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: import("better-auth").RawError<"ORGANIZATION_MEMBERSHIP_LIMIT_REACHED">;
            YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION">;
            YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION">;
            YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM">;
            YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM">;
            INVITATION_LIMIT_REACHED: import("better-auth").RawError<"INVITATION_LIMIT_REACHED">;
            TEAM_MEMBER_LIMIT_REACHED: import("better-auth").RawError<"TEAM_MEMBER_LIMIT_REACHED">;
            USER_IS_NOT_A_MEMBER_OF_THE_TEAM: import("better-auth").RawError<"USER_IS_NOT_A_MEMBER_OF_THE_TEAM">;
            YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: import("better-auth").RawError<"YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM">;
            YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: import("better-auth").RawError<"YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM">;
            YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER">;
            YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER">;
            YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION">;
            YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: import("better-auth").RawError<"YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION">;
            MISSING_AC_INSTANCE: import("better-auth").RawError<"MISSING_AC_INSTANCE">;
            YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: import("better-auth").RawError<"YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE">;
            YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE">;
            YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE">;
            YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE">;
            YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE">;
            YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE">;
            YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE">;
            TOO_MANY_ROLES: import("better-auth").RawError<"TOO_MANY_ROLES">;
            INVALID_RESOURCE: import("better-auth").RawError<"INVALID_RESOURCE">;
            ROLE_NAME_IS_ALREADY_TAKEN: import("better-auth").RawError<"ROLE_NAME_IS_ALREADY_TAKEN">;
            CANNOT_DELETE_A_PRE_DEFINED_ROLE: import("better-auth").RawError<"CANNOT_DELETE_A_PRE_DEFINED_ROLE">;
            ROLE_IS_ASSIGNED_TO_MEMBERS: import("better-auth").RawError<"ROLE_IS_ASSIGNED_TO_MEMBERS">;
            INVALID_TEAM_ID: import("better-auth").RawError<"INVALID_TEAM_ID">;
        };
        options: NoInfer<{
            schema: {
                organization: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        updatedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                team: {
                    additionalFields: {
                        description: {
                            type: "string";
                            required: false;
                            input: true;
                        };
                        slug: {
                            type: "string";
                            required: true;
                            input: true;
                        };
                        deletedAt: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
            };
            teams: {
                enabled: false;
            };
            ac: {
                newRole<const TRoleStatements extends import("better-auth/plugins").Statements>(statements: import("better-auth/plugins").RoleInput<{
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }, TRoleStatements>): import("better-auth/plugins").Role<import("better-auth/plugins").ExactRoleStatements<TRoleStatements>, {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                }>;
                statements: {
                    readonly organization: readonly ["create", "read", "update", "delete", "share"];
                    readonly project: readonly ["create", "read", "update", "delete", "share"];
                    readonly user: readonly ["read", "update", "delete", "share"];
                    readonly team: readonly ["create", "read", "update", "delete", "share"];
                    readonly task: readonly ["create", "read", "update", "delete", "share"];
                    readonly milestone: readonly ["create", "read", "update", "delete", "share"];
                    readonly comment: readonly ["create", "read", "update", "delete", "share"];
                    readonly attachment: readonly ["create", "read", "update", "delete", "share"];
                    readonly timeEntry: readonly ["create", "read", "update", "delete", "share"];
                    readonly client: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversation: readonly ["create", "read", "update", "delete", "share"];
                    readonly message: readonly ["create", "read", "update", "delete", "share"];
                    readonly notification: readonly ["read", "update", "delete", "share"];
                    readonly activity: readonly ["read", "update", "delete", "share"];
                    readonly projectTemplate: readonly ["create", "read", "update", "delete", "share"];
                    readonly projectUser: readonly ["create", "read", "update", "delete", "share"];
                    readonly taskAssignment: readonly ["create", "read", "update", "delete", "share"];
                    readonly conversationMember: readonly ["create", "read", "update", "delete", "share"];
                    readonly member: readonly ["read", "update", "delete", "share"];
                    readonly invitation: readonly ["create", "read", "update", "delete", "share"];
                };
            };
            dynamicAccessControl: {
                enabled: true;
            };
        }>;
    }, {
        id: "custom-session";
        version: string;
        hooks: {
            after: {
                matcher: (ctx: import("better-auth").HookEndpointContext) => boolean;
                handler: import("better-auth").Middleware<import("better-auth").MiddlewareOptions, (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    user: import("../modules/users/user.dto.js").UserSessionDto;
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                }[] | undefined>>;
            }[];
        };
        endpoints: {
            getSession: import("better-auth").StrictEndpoint<"/get-session", {
                method: "GET";
                query: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    disableCookieCache: import("better-auth").ZodOptional<import("better-auth").ZodCoercedBoolean<unknown>>;
                    disableRefresh: import("better-auth").ZodOptional<import("better-auth").ZodCoercedBoolean<unknown>>;
                }, import("zod/v4/core").$strip>>;
                metadata: {
                    CUSTOM_SESSION: boolean;
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            nullable: boolean;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                requireHeaders: true;
            }, {
                user: import("../modules/users/user.dto.js").UserSessionDto;
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
            } | null>;
        };
        $Infer: {
            Session: {
                user: import("../modules/users/user.dto.js").UserSessionDto;
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
            };
        };
        options: import("better-auth/plugins").CustomSessionPluginOptions | undefined;
    }];
}>;
export default auth;
//# sourceMappingURL=auth.d.ts.map