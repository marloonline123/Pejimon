import Express, {} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
const app = Express();
// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routing
app.use('/', (req, res, next) => {
    console.log("Server is running");
    res.send("Server is running");
});
// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
//# sourceMappingURL=main.js.map