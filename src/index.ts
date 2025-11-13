import "dotenv/config";
import "module-alias/register";
import express from "express";

import { Bot } from "@core/Bot";
import { Logger } from "@utils/logger";

//  Servidor Express para Render o Better Stack
const app = express();

// Endpoint básico
app.get("/", (_, res) => res.send("Miko bot is alive! ❤️"));

//  Variable global del bot
let client: Bot;

// endpoint de monitoreo (Better Stack)
app.get("/status", (_, res) => {
  const isReady = client?.isReady?.() ?? false;

  res.status(isReady ? 200 : 500).json({
    alive: true,
    discord_connected: isReady,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Iniciar servidor web
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Logger.out({
    prefix: "[WEB]",
    message: `🌐 Web server running on port ${PORT}`,
    color: "Green",
    important: true,
  });
});

// función principal para iniciar el bot
async function startBot() {
  try {
    client = new Bot();
    await client.start();

    Logger.out({
      prefix: "[BOT]",
      message: "✅ Bot iniciado correctamente.",
      color: "Green",
      important: true,
    });
  } catch (error: any) {
    Logger.err({
      prefix: "[BOT]",
      message: `💥 Error al iniciar el bot: ${error?.stack || error}`,
      color: "Red",
      important: true,
    });
  }
}

// Reinicio suave 
async function restartBot() {
  try {
    Logger.out({
      prefix: "[RESTART]",
      message: "♻️ Reiniciando el bot tras error crítico...",
      color: "Yellow",
      important: true,
    });

    if (client && typeof client.destroy === "function") {
      await client.destroy();
    }

    // Espera unos segundos antes de reiniciar (para evitar loops)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await startBot();

    Logger.out({
      prefix: "[RESTART]",
      message: "✅ Bot reiniciado correctamente.",
      color: "Green",
      important: true,
    });
  } catch (error: any) {
    Logger.err({
      prefix: "[RESTART]",
      message: `💣 Falló el reinicio del bot: ${error?.stack || error}`,
      color: "Red",
      important: true,
    });
  }
}

// Inicia el bot por primera vez
startBot();

// Manejadores de errores
process.on("unhandledRejection", async (reason: any) => {
  Logger.err({
    prefix: "[GLOBAL]",
    message: `⚠️ Unhandled Rejection: ${reason?.stack || reason}`,
    color: "Red",
    important: true,
  });

  if (String(reason).includes("DiscordAPIError") ||
      String(reason).includes("Unknown interaction") ||
      String(reason).includes("ECONNRESET")) {
    await restartBot();
  }
});

process.on("uncaughtException", async (error: any) => {
  Logger.err({
    prefix: "[GLOBAL]",
    message: `💥 Uncaught Exception: ${error?.stack || error}`,
    color: "Red",
    important: true,
  });

  if (error.message?.includes("DiscordAPIError") ||
      error.message?.includes("Unknown interaction") ||
      error.message?.includes("ECONNRESET")) {
    await restartBot();
  }
});

process.on("uncaughtExceptionMonitor", (error: any) => {
  Logger.err({
    prefix: "[GLOBAL]",
    message: `🧩 Exception monitored: ${error?.stack || error}`,
    color: "Yellow",
  });
});

export { client };
