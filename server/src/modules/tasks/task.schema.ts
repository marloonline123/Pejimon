import z from "zod";
import { Status } from "@prisma/client";

const taskSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.enum(Status),
  priority: z.string(),
  tags: z.string().optional(),
  startDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  points: z.number().int().optional(),
  projectId: z.number().int(),
  authorId: z.number().int(),
  assignedUserId: z.number().int(),
});

export const taskQuerySchema = z.object({
  projectSlug: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
});

export default taskSchema;

export type TaskSchema = z.infer<typeof taskSchema>;
export type TaskQuerySchema = z.infer<typeof taskQuerySchema>;
