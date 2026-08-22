import Express, { type Application, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app: Application = Express();



// Middleware

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    console.log("Server is running");
    res.send("Server is running");
});

// Global error handling

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

