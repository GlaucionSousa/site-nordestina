const sequelize = require("../config/db");
const Review = require("./review");
const Tip = require("./tip");
const Contact = require("./contact");
const Gallery = require("./gallery");

async function init({ sync = true } = {}) {
  // inicializa modelos
  const models = {
    Review: Review(sequelize),
    Tip: Tip(sequelize),
    Contact: Contact(sequelize),
    Gallery: Gallery(sequelize),
  };

  // Associações (nenhuma complexa aqui)
  // Ex.: models.User.hasMany(models.Review);

  if (sync) {
    await sequelize.sync({ alter: true });
    console.log("Database synced");
  }

  return models;
}

// se rodar node src/models/index.js vai sincronizar
if (require.main === module) {
  init({ sync: true })
    .then(() => {
      console.log("Sync complete");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = init;
