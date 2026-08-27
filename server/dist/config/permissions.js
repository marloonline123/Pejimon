import { createAccessControl } from "better-auth/plugins/access";
/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
    organization: ["create", "read", "update", "delete", "share"],
    project: ["create", "read", "update", "delete", "share"],
    user: ["read", "update", "delete", "share"],
    team: ["create", "read", "update", "delete", "share"],
    task: ["create", "read", "update", "delete", "share"],
    milestone: ["create", "read", "update", "delete", "share"],
    comment: ["create", "read", "update", "delete", "share"],
    attachment: ["create", "read", "update", "delete", "share"],
    timeEntry: ["create", "read", "update", "delete", "share"],
    client: ["create", "read", "update", "delete", "share"],
    conversation: ["create", "read", "update", "delete", "share"],
    message: ["create", "read", "update", "delete", "share"],
    notification: ["read", "update", "delete", "share"],
    activity: ["read", "update", "delete", "share"],
    projectTemplate: ["create", "read", "update", "delete", "share"],
    projectUser: ["create", "read", "update", "delete", "share"],
    taskAssignment: ["create", "read", "update", "delete", "share"],
    conversationMember: ["create", "read", "update", "delete", "share"],
    member: ["read", "update", "delete", "share"],
    invitation: ["create", "read", "update", "delete", "share"],
};
const ac = createAccessControl(statement);
export default ac;
//# sourceMappingURL=permissions.js.map