import Express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import projectRouter from "@/modules/projects/project.routes.js";
import taskRouter from "@/modules/tasks/task.routes.js";
import teamRouter from "@/modules/teams/team.routes.js";
import userRouter from "@/modules/users/user.routes.js";
import organizationRouter from "@/modules/organizations/organization.routes.js";
import subscriptionRouter from "@/modules/subscriptions/subscription.routes.js";
import { toNodeHandler } from "better-auth/node";
import auth from "@/config/auth.js";

import path from "path";

dotenv.config();

const app: Application = Express();

// Middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));

// Better-Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(Express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Files
app.use("/uploads", Express.static(path.join(process.cwd(), "uploads")));

// Routing
app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server is running");
});

app.use("/projects", projectRouter);
app.use("/tasks", taskRouter);
app.use("/teams", teamRouter);
app.use("/users", userRouter);
app.use("/organizations", organizationRouter);
app.use("/subscriptions", subscriptionRouter);

// Global error handling

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
