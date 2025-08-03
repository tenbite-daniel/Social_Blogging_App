import express from "express";
import cors from "cors";
import path from "path";
import { corsOptions } from "./config/corsOptions.js";
import { connectDB } from "./config/db.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// cors options
app.use(cors(corsOptions));
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.send("API is running...");
    console.log("works");
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};

startServer();