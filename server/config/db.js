const mongoose = require("mongoose");

// Handle connection events
mongoose.connection.on("disconnected", () => {
    console.log("-------- DB disconnected --------");
});

mongoose.connection.on("error", (err) => {
    console.log("-------- DB connection error -----");
    console.log(err.message);
});

mongoose.connection.on("reconnected", () => {
    console.log("-------- DB reconnected --------");
});

const connectDB = async () => {
    try {
        // If already connected, return
        if (mongoose.connection.readyState === 1) {
            return;
        }
        
        await mongoose.connect(process.env.MONGO_DB_URL, {
            dbName: "backend-template-db",
            serverSelectionTimeoutMS: 10000, // Timeout after 10s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log("-------- DB connected --------");
    } catch (err) {
        console.log("----- DB connection error -----");
        console.log(err.message);
        console.log("----- ----------------- -----");
        throw err; // Re-throw to let caller handle retry
    }
};

module.exports = connectDB;
