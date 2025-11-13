import "dotenv/config";
import "module-alias/register";
import express from "express";
import { Bot } from "@core/Bot";
import { Logger } from "@utils/logger";

const app = express();

app.get("/", (_, res) => res.send("Miko bot is alive! ❤️"));

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

const client = new Bot();

client
  .start()
  .then(() => {
    Logger.out({
      prefix: "[BOT]",
      message: "✅ Miko started successfully.",
      color: "Green",
      important: true,
    });
  })
  .catch((err) => {
    Logger.err({
      prefix: "[BOT]",
      message: `❌ Failed to start Miko: ${err.message}`,
      color: "Red",
      important: true,
    });
  });

process.on("unhandledRejection", (reason: any) => {
  Logger.err({
    prefix: "[UNHANDLED REJECTION]",
    message: reason?.stack || reason?.message || String(reason),
    color: "Red",
    important: true,
  });
});

process.on("uncaughtException", (err: Error) => {
  Logger.err({
    prefix: "[UNCAUGHT EXCEPTION]",
    message: err.stack || err.message,
    color: "Red",
    important: true,
  });
});

process.on("uncaughtExceptionMonitor", (err: Error) => {
  Logger.err({
    prefix: "[EXCEPTION MONITOR]",
    message: err.stack || err.message,
    color: "Red",
    important: true,
  });
});

export { client };
