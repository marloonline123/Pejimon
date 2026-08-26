// ============================================================
// USERS
// ============================================================

Table users {
id integer [primary key, increment]

name varchar [not null]
username varchar [unique, not null]
phone_number varchar [unique]
email varchar [unique, not null]
password varchar [not null]

profilePicturePath varchar

emailVerifiedAt timestamp

// Soft deletion
deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(deletedAt)
}
}

// ============================================================
// ORGANIZATIONS
// ============================================================

Table organizations {
id integer [primary key, increment]

name varchar [not null]
slug varchar [unique, not null]

description text
logoPath varchar

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(deletedAt)
}
}

// ============================================================
// ORGANIZATION MEMBERS
// ============================================================

Table organization_members {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]
userId integer [ref: > users.id, not null]

// ONLY:
// OWNER
// MEMBER
role varchar [not null]

created_at timestamp
updated_at timestamp

indexes {
(organizationId, userId) [unique]
(organizationId)
(userId)
}
}

// ============================================================
// ORGANIZATION INVITATIONS
// ============================================================

Table organization_invitations {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

email varchar [not null]

tokenHash varchar [unique, not null]

invitedById integer [ref: > users.id, not null]

expiresAt timestamp [not null]
acceptedAt timestamp

created_at timestamp

indexes {
(organizationId, email)
(tokenHash)
}
}

// ============================================================
// REFRESH TOKENS
// ============================================================

Table refresh_tokens {
id integer [primary key, increment]

userId integer [ref: > users.id, not null]

tokenHash varchar [unique, not null]

deviceName varchar
platform varchar

expiresAt timestamp [not null]
revokedAt timestamp

lastUsedAt timestamp

created_at timestamp

indexes {
(userId)
(tokenHash)
}
}

// ============================================================
// EMAIL VERIFICATION
// ============================================================

Table email_verification_tokens {
id integer [primary key, increment]

userId integer [ref: > users.id, not null]

tokenHash varchar [unique, not null]

expiresAt timestamp [not null]
usedAt timestamp

created_at timestamp

indexes {
(userId)
(tokenHash)
}
}

// ============================================================
// PASSWORD RESET
// ============================================================

Table password_reset_tokens {
id integer [primary key, increment]

userId integer [ref: > users.id, not null]

tokenHash varchar [unique, not null]

expiresAt timestamp [not null]
usedAt timestamp

created_at timestamp

indexes {
(userId)
(tokenHash)
}
}

// ============================================================
// TEAMS
// ============================================================

Table teams {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

name varchar [not null]
slug varchar [not null]
description text

managerId integer [ref: > users.id, not null]

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(organizationId, slug) [unique]
(organizationId)
(managerId)
(deletedAt)
}
}

// ============================================================
// TEAM MEMBERS
// ============================================================

Table team_user {
userId integer [ref: > users.id, not null]
teamId integer [ref: > teams.id, not null]

created_at timestamp

indexes {
(userId, teamId) [unique]
(userId)
(teamId)
}
}

// ============================================================
// PROJECTS
// ============================================================

Table projects {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

name varchar [not null]
slug varchar [not null]

description text

startDate date
endDate date

status varchar [not null]

// PLANNING
// ACTIVE
// ON_HOLD
// COMPLETED
// ARCHIVED

createdById integer [ref: > users.id, not null]

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(organizationId, slug) [unique]
(organizationId)
(createdById)
(status)
(deletedAt)
}
}

// ============================================================
// PROJECT TEAMS
// ============================================================

Table project_team {
projectId integer [ref: > projects.id, not null]
teamId integer [ref: > teams.id, not null]

indexes {
(projectId, teamId) [unique]
(projectId)
(teamId)
}
}

// ============================================================
// PROJECT MEMBERS
// ============================================================

Table project_user {
id integer [primary key, increment]

projectId integer [ref: > projects.id, not null]
userId integer [ref: > users.id, not null]

role varchar [not null]

// MANAGER
// MEMBER
// VIEWER

created_at timestamp

indexes {
(projectId, userId) [unique]
(projectId)
(userId)
}
}

// ============================================================
// TASKS
// ============================================================

Table tasks {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]
projectId integer [ref: > projects.id, not null]
milestoneId integer [ref: > milestones.id]

name varchar [not null]
slug varchar [not null]

description text

status varchar [not null]

// TODO
// IN_PROGRESS
// UNDER_REVIEW
// COMPLETED
// CANCELLED

priority varchar [not null]

// LOW
// MEDIUM
// HIGH
// URGENT

tags varchar

startDate date
dueDate date

points integer

estimatedHours integer

authorId integer [ref: > users.id, not null]

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(organizationId)
(projectId)
(projectId, slug) [unique]
(projectId, status)
(projectId, dueDate)
(deletedAt)
}
}

// ============================================================
// TASK ASSIGNMENTS
// ============================================================

Table task_assignments {
id integer [primary key, increment]

taskId integer [ref: > tasks.id, not null]
userId integer [ref: > users.id, not null]

description text

assignedById integer [ref: > users.id]

created_at timestamp

indexes {
(taskId, userId) [unique]
(taskId)
(userId)
}
}

// ============================================================
// TASK DEPENDENCIES
// ============================================================

Table task_dependencies {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

taskId integer [ref: > tasks.id, not null]
dependsOnTaskId integer [ref: > tasks.id, not null]

created_at timestamp

indexes {
(taskId, dependsOnTaskId) [unique]
(taskId)
(dependsOnTaskId)
}
}

// ============================================================
// MILESTONES
// ============================================================

Table milestones {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]
projectId integer [ref: > projects.id, not null]

name varchar [not null]
description text

dueDate date

status varchar [not null]

// OPEN
// COMPLETED
// CANCELLED

createdById integer [ref: > users.id, not null]

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(organizationId)
(projectId)
(projectId, dueDate)
(deletedAt)
}
}

// ============================================================
// COMMENTS
// ============================================================

Table comments {
id integer [primary key, increment]

body text [not null]

organizationId integer [ref: > organizations.id, not null]

taskId integer [ref: > tasks.id, not null]
userId integer [ref: > users.id, not null]

parentId integer [ref: > comments.id]

created_at timestamp
updated_at timestamp

deletedAt timestamp

indexes {
(taskId, created_at)
(userId)
(parentId)
(deletedAt)
}
}

// ============================================================
// ATTACHMENTS
// ============================================================

Table attachments {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

name varchar [not null]

// Object storage key
// Example:
// organizations/42/projects/10/tasks/20/file.pdf
path varchar [not null]

mimeType varchar
size integer

uploadedById integer [ref: > users.id, not null]

taskId integer [ref: > tasks.id]
projectId integer [ref: > projects.id]
messageId integer [ref: > messages.id]

deletedAt timestamp

created_at timestamp

indexes {
(organizationId)
(taskId)
(projectId)
(messageId)
(deletedAt)
}
}

// ============================================================
// TIME ENTRIES
// ============================================================

Table time_entries {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

taskId integer [ref: > tasks.id, not null]
userId integer [ref: > users.id, not null]

startedAt timestamp [not null]
endedAt timestamp

durationHours integer

description text

created_at timestamp
}

// ============================================================
// CLIENTS
// ============================================================

Table clients {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

userId integer [ref: > users.id]

companyName varchar

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(organizationId)
(userId)
(deletedAt)
}
}

// ============================================================
// PROJECT CLIENTS
// ============================================================

Table project_clients {
id integer [primary key, increment]

projectId integer [ref: > projects.id, not null]
clientId integer [ref: > clients.id, not null]

created_at timestamp

indexes {
(projectId, clientId) [unique]
(projectId)
(clientId)
}
}

// ============================================================
// CLIENT INVITATIONS
// ============================================================

Table client_invitations {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

email varchar [not null]

tokenHash varchar [unique, not null]

expiresAt timestamp [not null]
acceptedAt timestamp

created_at timestamp

indexes {
(organizationId)
(tokenHash)
}
}

// ============================================================
// CLIENT APPROVALS
// ============================================================

Table client_approvals {
id integer [primary key, increment]

projectId integer [ref: > projects.id, not null]
clientId integer [ref: > clients.id, not null]

title varchar [not null]
description text

status varchar [not null]

// PENDING
// APPROVED
// CHANGES_REQUESTED

respondedAt timestamp
response text

created_at timestamp
updated_at timestamp

deletedAt timestamp

indexes {
(projectId)
(clientId)
(projectId, status)
(deletedAt)
}
}

// ============================================================
// CONVERSATIONS
// ============================================================

Table conversations {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

projectId integer [ref: > projects.id]

taskId integer [ref: > tasks.id]

teamId integer [ref: > teams.id]

userId integer [ref: > users.id]

createdById integer [ref: > users.id]

name varchar

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(organizationId)
(projectId)
(deletedAt)
}
}

// ============================================================
// CONVERSATION MEMBERS
// ============================================================

Table conversation_members {
id integer [primary key, increment]

conversationId integer [ref: > conversations.id, not null]
userId integer [ref: > users.id, not null]

joinedAt timestamp

indexes {
(conversationId, userId) [unique]
(conversationId)
(userId)
}
}

// ============================================================
// MESSAGES
// ============================================================

Table messages {
id integer [primary key, increment]

conversationId integer [ref: > conversations.id, not null]
senderId integer [ref: > users.id, not null]

content text [not null]

created_at timestamp
updated_at timestamp

deletedAt timestamp

indexes {
(conversationId, created_at)
(senderId)
(deletedAt)
}
}

// ============================================================
// NOTIFICATIONS
// ============================================================

Table notifications {
id integer [primary key, increment]

userId integer [ref: > users.id, not null]

type varchar [not null]

title varchar [not null]
message text [not null]

data text

readAt timestamp

created_at timestamp

indexes {
(userId, created_at)
(userId, readAt)
}
}

// ============================================================
// ACTIVITIES
// ============================================================

Table activities {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

projectId integer [ref: > projects.id]

actorId integer [ref: > users.id, not null]

action varchar [not null]

entityType varchar [not null]
entityId integer [not null]

metadata text

created_at timestamp

indexes {
(organizationId, created_at)
(projectId, created_at)
(entityType, entityId)
(actorId)
}
}

// ============================================================
// PROJECT TEMPLATES
// ============================================================

Table project_templates {
id integer [primary key, increment]

organizationId integer [ref: > organizations.id, not null]

name varchar [not null]
description text

createdById integer [ref: > users.id, not null]

deletedAt timestamp

created_at timestamp
updated_at timestamp

indexes {
(organizationId)
(deletedAt)
}
}

// ============================================================
// TEMPLATE MILESTONES
// ============================================================

Table template_milestones {
id integer [primary key, increment]

templateId integer [ref: > project_templates.id, not null]

name varchar [not null]
description text

sortOrder integer

created_at timestamp
}

// ============================================================
// TEMPLATE TASKS
// ============================================================

Table template_tasks {
id integer [primary key, increment]

templateId integer [ref: > project_templates.id, not null]

milestoneId integer [ref: > template_milestones.id]

name varchar [not null]
description text

priority varchar

estimatedMinutes integer

sortOrder integer

created_at timestamp
}
