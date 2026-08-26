import z from "zod";
import { Status } from "@prisma/client";

const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  status: z.enum(Status),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  teamIds: z.array(z.number()).optional(),
});

export const projectQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
});

export default projectSchema;

export type ProjectSchema = z.infer<typeof projectSchema>;
export type ProjectQuerySchema = z.infer<typeof projectQuerySchema>;
