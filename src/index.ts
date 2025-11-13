import "dotenv/config";
import "module-alias/register";
import express from "express";
import { Bot } from "@core/Bot";
import { Logger } from "@utils/logger";

const app = express();

app.get("/", (_, res) => res.send("Miko bot is alive! ❤️"));

const client = new Bot();

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

client.start().catch((err) => {
  Logger.err({
    prefix: "[ERROR]",
    message: `An error has occurred while starting the bot.`,
    important: true,
  });
  Logger.err({
    prefix: "[ERROR]",
    message: err.stack || "Unknown error",
  });
});

process.on("unhandledRejection", (reason: any) => {
  Logger.err({
    prefix: "[UNHANDLED REJECTION]",
    message: reason?.stack || reason,
    color: "Red",
    important: true,
  });
});

process.on("uncaughtException", (error: any) => {
  Logger.err({
    prefix: "[UNCAUGHT EXCEPTION]",
    message: error?.stack || error,
    color: "Red",
    important: true,
  });
});

export { client };
