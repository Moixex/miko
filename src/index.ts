import "dotenv/config";
import "module-alias/register";
import express from "express";

import { Bot } from "@core/Bot";
import { Logger } from "@utils/logger";

// Servidor Express para que Render o Better Stack detecten un puerto
const app = express();

//  Endpoint 
app.get("/", (_, res) => res.send("Miko bot is alive! ❤️"));

//  Endpoint para Better Stack 
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

// Inicia el bot normalmente
const client = new Bot();

client
  .start()
  .catch((err) => {
    Logger.err({
      prefix: "[ERROR]",
      message: `An error has occurred.`,
      important: true,
    });
    Logger.err({
      prefix: "[ERROR]",
      message: err.stack || "Unknown error",
    });
  });

// Manejadores globales de errores para evitar caídas
process.on("uncaughtException", (err) => {
  Logger.err({
    prefix: "[FATAL]",
    message: `❌ Uncaught Exception: ${err.message}`,
    important: true,
  });
  Logger.err({
    prefix: "[FATAL]",
    message: err.stack || "No stack trace available",
  });
});

process.on("unhandledRejection", (reason: any) => {
  Logger.err({
    prefix: "[FATAL]",
    message: `⚠️ Unhandled Promise Rejection: ${reason}`,
    important: true,
  });
});

export { client };
