import "dotenv/config";
import "module-alias/register";
import express from "express";

import { Bot } from "@core/Bot";
import { Logger } from "@utils/logger";

// 🧠 Servidor Express para que Render o Better Stack detecten un puerto
const app = express();

// ✅ Endpoint básico
app.get("/", (_, res) => res.send("Miko bot is alive! ❤️"));

// ⚙️ Inicia el bot
const client = new Bot();

// ✅ Endpoint de monitoreo para Better Stack
app.get("/status", (_, res) => {
  const isReady = client?.isReady?.() ?? false;

  res.status(isReady ? 200 : 500).json({
    alive: true,
    discord_connected: isReady,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Logger.out({
    prefix: "[WEB]",
    message: `🌐 Web server running on port ${PORT}`,
    color: "Green",
    important: true,
  });
});

// 🧩 Inicia el cliente
client
  .start()
  .catch((err) => {
    Logger.err({
      prefix: "[ERROR]",
      message: `An error occurred while starting the bot.`,
      important: true,
    });
    Logger.err({
      prefix: "[ERROR]",
      message: err.stack || "Unknown error",
    });
  });

// 🛡️ Manejadores globales de errores para evitar caídas
process.on("unhandledRejection", (reason: any) => {
  Logger.err({
    prefix: "[GLOBAL]",
    message: `⚠️ Unhandled Rejection: ${reason?.stack || reason}`,
    color: "Red",
    important: true,
  });
});

process.on("uncaughtException", (error: any) => {
  Logger.err({
    prefix: "[GLOBAL]",
    message: `💥 Uncaught Exception: ${error?.stack || error}`,
    color: "Red",
    important: true,
  });
});

process.on("uncaughtExceptionMonitor", (error: any) => {
  Logger.err({
    prefix: "[GLOBAL]",
    message: `🧩 Exception monitored: ${error?.stack || error}`,
    color: "Yellow",
  });
});

export { client };
