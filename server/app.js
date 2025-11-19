const dotEnv = require("dotenv");
dotEnv.config();
const connectDB = require("./config/db");
require("./utils/emailHelpers");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { apiRouter } = require("./api/v1/routes");

const app = express();

app.use(morgan("dev")); 

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", apiRouter);

// Wait for DB connection before starting server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        app.listen(process.env.PORT, () => {
            console.log("-------- Server started --------");
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        console.log("Retrying connection in 5 seconds...");
        setTimeout(startServer, 5000);
    }
};

startServer();