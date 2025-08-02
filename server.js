const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const riderRoutes = require("./routes/RiderRoutes");
const organizerRoutes = require("./routes/organizerRoutes");

dotenv.config();
const app = express();
app.use(cors()); //cross origin resource
app.use(express.json()); //used to get the input given in json format

app.use("/api/rider", riderRoutes);
app.use("/api/organizer", organizerRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected->project initiiated");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
