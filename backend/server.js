const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Environment configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://frontend", "http://localhost", "http://localhost:3000"];

const corsOptions = {
      origin: (origin, callback) => {
            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                  callback(null, true);
            } else {
                  console.warn(`Blocked by CORS: ${origin}`);
                  callback(new Error("Not allowed by CORS"));
            }
      },
      methods: "GET,POST,PUT,DELETE,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
      credentials: true,
      optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const DB_HOST = process.env.DB_HOST || "mongo";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "appdb";
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const MONGO_URI = `mongodb://${DB_USER}:${encodeURIComponent(
      DB_PASS
)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

const connectWithRetry = () => {
      mongoose
            .connect(MONGO_URI, {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
                  serverSelectionTimeoutMS: 5000,
            })
            .then(() => console.log("MongoDB connected"))
            .catch((err) => {
                  console.error("MongoDB connection error:", err.message);
                  setTimeout(connectWithRetry, 5000);
            });
};

mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected! Reconnecting...");
      connectWithRetry();
});

connectWithRetry();

// Data model
const ItemSchema = new mongoose.Schema(
      {
            name: String,
            value: Number,
      },
      { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);

// Logging middleware
app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
});

// API Endpoints
app.get("/api/health", (req, res) => {
      res.status(200).json({
            status: "UP",
            dbStatus: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
      });
});

app.get("/api/items", async (req, res) => {
      try {
            const items = await Item.find().sort({ createdAt: -1 }).limit(10);
            res.json(items);
      } catch (err) {
            console.error("Error fetching items:", err);
            res.status(500).json({ error: "Internal server error" });
      }
});

app.post("/api/items", async (req, res) => {
      try {
            const newItem = new Item(req.body);
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
      } catch (err) {
            console.error("Error creating item:", err);
            res.status(400).json({ error: "Invalid request" });
      }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});
