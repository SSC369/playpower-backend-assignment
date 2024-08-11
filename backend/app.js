const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const assignmentsRoutes = require("./routes/assignmentRoutes");
const { createAssignmentTable } = require("./models/assignmentModel");
const { createUserTable } = require("./models/userModel");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.configDotenv();

createAssignmentTable();
createUserTable();
app.get("/", (req, res) => {
  res.send("API is working:)");
});
app.use("/api/auth", authRoutes);
app.use("/api", assignmentsRoutes);

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
