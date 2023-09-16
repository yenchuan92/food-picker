const express = require("express");
const cors = require("cors");

const appRoutes = require("./routes/routes");

const app = express();

// using express middleware so the application can parse JSON
app.use(express.json());
app.use(cors());

app.use("/", appRoutes);

app.listen(8000, () => {
  console.log("Server started successfully on port 8000!");
});
