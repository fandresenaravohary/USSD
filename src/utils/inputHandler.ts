import readline from "readline";

export type InputResult = string | "BACK" | "TIMEOUT";

export class InputHandler {
  private rl: readline.Interface;
  private timeoutMs = 15000;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async ask(question: string): Promise<InputResult> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        console.log("\nTemps écoulé. Retour au menu principal.");
        resolve("TIMEOUT");
      }, this.timeoutMs);

      this.rl.question(question, (answer) => {
        clearTimeout(timer);
        const trimmed = answer.trim();
        resolve(trimmed === "*" ? "BACK" : trimmed);
      });
    });
  }

  close(): void {
    this.rl.close();
  }
}
