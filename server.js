const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const riderRoutes = require("./routes/RiderRoutes");
const organizerRoutes = require("./routes/organizerRoutes");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
    "http://localhost:3000", // for local dev
    "https://caterrides-frontend.vercel.app" // for deployed frontend
  ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/rider", riderRoutes);
app.use("/api/organizer", organizerRoutes);

const PORT = process.env.PORT || 10000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected -> project initiated");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
