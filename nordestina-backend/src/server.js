const app = require("./app");
const initModels = require("./models");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 4000;

async function start() {
  // Inicializar modelos & sincronizar
  await initModels({ sync: true });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    // Generating a sample admin token for dev (use real auth in production)
    const secret = process.env.JWT_SECRET || "secret_dev_key";
    const adminToken = jwt.sign({ role: "admin", name: "dev-admin" }, secret, {
      expiresIn: "30d",
    });
    console.log("Admin token (dev):", adminToken);
    console.log("Use header: Authorization: Bearer <token>");
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
