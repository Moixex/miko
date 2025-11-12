import "dotenv/config";
import "module-alias/register";
import express from "express"; // 👈 Agregado para Render

import { Bot } from "@core/Bot";
import { Logger } from "@utils/logger";

// 🧠 Servidor Express para que Render detecte un puerto
const app = express();
app.get("/", (_, res) => res.send("Miko bot is alive! ❤️"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Logger.info({ prefix: "[WEB]", message: `🌐 Web server running on port ${PORT}` });
});

// 🧩 Inicia el bot normalmente
const client = new Bot();

client
  .start()
  .catch((err) => {
    Logger.err({ prefix: "[ERROR]", message: `An error has occurred.`, important: true });
    Logger.err({ prefix: "[ERROR]", message: err.stack });
  });

export { client };
