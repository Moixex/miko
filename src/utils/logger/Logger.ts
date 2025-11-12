import { ColorHelper, TimeHelper, Color } from "@utils/helpers";
import chalk from "chalk";

export type LogCreatorParameters = {
  prefix: string;
  message: string;
  color?: Color;
  important?: boolean;
};

export abstract class Logger {
  private static formatMessage(params: LogCreatorParameters, colorHex: string, isError = false): void {
    const date = TimeHelper.nowFormatted();
    const color = chalk.hex(colorHex);
    const reset = `\x1b[0m`;

    params.message.split("\n").forEach(line => {
      if (!line.trim()) return;

      if (!params.important) {
        console[isError ? "error" : "log"](
          `${color("●")} ${date} ${color.bold(params.prefix)} ${chalk.reset(line)}`
        );
      } else {
        console[isError ? "error" : "log"](
          `${color("●")} ${date} ${color.bold(`${params.prefix} ${line}`)}${reset}`
        );
      }
    });
  }

  public static out(params: LogCreatorParameters): void {
    this.formatMessage(params, ColorHelper.getHexColor(params.color || "Green"));
  }

  public static err(params: LogCreatorParameters): void {
    this.formatMessage(params, "#FF0000", true);
  }

  // 👇 Métodos más simples y cómodos
  public static info(message: string, prefix = "[INFO]") {
    this.out({ prefix, message, color: "Green" });
  }

  public static warn(message: string, prefix = "[WARN]") {
    this.out({ prefix, message, color: "Yellow" });
  }

  public static error(message: string, prefix = "[ERROR]") {
    this.err({ prefix, message, important: true });
  }
}
