import { Account } from "../models/account";
import { InputHandler } from "../utils/inputHandler";

export class UssdService {
  private inputHandler: InputHandler;
  private account: Account;

  constructor(account: Account) {
    this.inputHandler = new InputHandler();
    this.account = account;
  }

  async startSession(): Promise<void> {
    console.log("\nWelcome to the USSD MyTel service.");
    console.log("Enter a USSD code to start\n");

    while (true) {
      const code = await this.inputHandler.ask("USSD Code: ");
      if (code === "BACK" || code === "TIMEOUT") continue;

      if (code === "*123#") {
        await this.mainMenu();
        break;
      }

      console.log("Invalid code. Please try again.");
    }
  }

  private async mainMenu(): Promise<void> {
    while (true) {
      console.log(`
Main Menu MyTel (*123#)
1. Check balance
2. Top up account
3. Withdraw money
4. Transfer money
0. Exit service
`);
      const choice = await this.inputHandler.ask("Your choice: ");
      if (choice === "BACK" || choice === "TIMEOUT") continue;

      switch (choice) {
        case "1":
          this.showBalance();
          await this.afterActionMenu();
          break;
        case "2":
          await this.rechargeMenu();
          break;
        case "3":
          await this.withdrawMenu();
          break;
        case "4":
          await this.transferMenu();
          break;
        case "0":
          this.quit();
          return;
        default:
          console.log("Invalid choice.");
      }
    }
  }

  private showBalance(): void {
    console.log(`Current balance: ${this.account.checkBalance()} units.`);
  }

  private async rechargeMenu(): Promise<void> {
    while (true) {
      console.log(`
=== Top-up Menu ===
1. Enter a phone number to top up
0. Return to main menu
`);
      const choice = await this.inputHandler.ask("Your choice: ");
      if (choice === "BACK" || choice === "TIMEOUT") return;

      switch (choice) {
        case "1":
          await this.handleRecharge();
          return;
        case "0":
          return;
        default:
          console.log("Invalid choice.");
      }
    }
  }

  private async withdrawMenu(): Promise<void> {
    while (true) {
      console.log(`
=== Withdraw Menu ===
1. Enter an amount to withdraw
0. Return to main menu
`);
      const choice = await this.inputHandler.ask("Your choice: ");
      if (choice === "BACK" || choice === "TIMEOUT") return;

      switch (choice) {
        case "1":
          await this.handleWithdraw();
          return;
        case "0":
          return;
        default:
          console.log("Invalid choice.");
      }
    }
  }

  private async transferMenu(): Promise<void> {
    while (true) {
      console.log(`
=== Transfer Menu ===
1. Enter a number and amount to transfer
0. Return to main menu
`);
      const choice = await this.inputHandler.ask("Your choice: ");
      if (choice === "BACK" || choice === "TIMEOUT") return;

      switch (choice) {
        case "1":
          await this.handleTransfer();
          return;
        case "0":
          return;
        default:
          console.log("Invalid choice.");
      }
    }
  }

  private async handleRecharge(): Promise<void> {
    while (true) {
      const number = await this.inputHandler.ask(
        "Phone number (or * to cancel): "
      );
      if (number === "BACK" || number === "TIMEOUT") return;

      const isValid = /^0[3-4][0-9]{8}$/.test(number);
      if (!isValid) {
        console.log(
          "Invalid number. Expected format: 03XXXXXXXX or 04XXXXXXXX"
        );
        continue;
      }

      const amountStr = await this.inputHandler.ask(
        "Amount to top up (or * to cancel): "
      );
      if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount.");
        continue;
      }

      this.account.add(amount);
      console.log(`Top-up of ${amount} units successful.`);
      this.showBalance();
      await this.afterActionMenu();
      break;
    }
  }

  private async handleWithdraw(): Promise<void> {
    while (true) {
      const amountStr = await this.inputHandler.ask(
        "Amount to withdraw (or * to cancel): "
      );
      if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount.");
        continue;
      }

      try {
        this.account.spend(amount);
        console.log(`Withdrawal of ${amount} units successful.`);
        this.showBalance();
        await this.afterActionMenu();
        break;
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    }
  }

  private async handleTransfer(): Promise<void> {
    while (true) {
      const number = await this.inputHandler.ask(
        "Recipient number (or * to cancel): "
      );
      if (number === "BACK" || number === "TIMEOUT") return;

      const isValid = /^0[3-4][0-9]{8}$/.test(number);
      if (!isValid) {
        console.log(
          "Invalid number. Expected format: 03XXXXXXXX or 04XXXXXXXX"
        );
        continue;
      }

      const amountStr = await this.inputHandler.ask(
        "Amount to transfer (or * to cancel): "
      );
      if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount.");
        continue;
      }

      try {
        this.account.spend(amount);
        console.log(`Transfer of ${amount} units to ${number} successful.`);
        this.showBalance();
        await this.afterActionMenu();
        break;
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    }
  }

  private async afterActionMenu(): Promise<void> {
    console.log(`
What would you like to do?
1. Return to main menu
0. Exit
`);
    const choice = await this.inputHandler.ask("Your choice: ");
    if (choice === "0") {
      this.quit();
    }
  }

  private quit(): void {
    console.log("Thank you for using the MyTel service.");
    this.inputHandler.close();
    process.exit(0);
  }
}
