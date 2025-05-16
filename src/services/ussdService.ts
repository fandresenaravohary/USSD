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
    console.log("\nBienvenue sur le service USSD MyTel.");
    console.log("Entrez un code USSD pour démarrer\n");

    while (true) {
      const code = await this.inputHandler.ask("Code USSD : ");
      if (code === "BACK" || code === "TIMEOUT") continue;

      if (code === "*123#") {
        await this.mainMenu();
        break;
      }

      console.log("Code invalide. Veuillez réessayer.");
    }
  }

  private async mainMenu(): Promise<void> {
    while (true) {
      console.log(`
Menu Principal MyTel (*123#)
1. Consulter mon solde
2. Recharger mon compte
3. Retirer de l'argent
4. Transférer de l'argent
0. Quitter le service
`);
      const choice = await this.inputHandler.ask("Votre choix : ");
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
          console.log("Choix invalide.");
      }
    }
  }

  private showBalance(): void {
    console.log(`Solde actuel : ${this.account.checkBalance()} unités.`);
  }

  private async rechargeMenu(): Promise<void> {
    while (true) {
      console.log(`
=== Menu Recharge ===
1. Entrer un numéro de téléphone pour recharger
0. Retour au menu principal
`);
      const choice = await this.inputHandler.ask("Votre choix : ");
      if (choice === "BACK" || choice === "TIMEOUT") return;

      switch (choice) {
        case "1":
          await this.handleRecharge();
          return;
        case "0":
          return;
        default:
          console.log("Choix invalide.");
      }
    }
  }

  private async withdrawMenu(): Promise<void> {
    while (true) {
      console.log(`
=== Menu Retrait ===
1. Entrer un montant à retirer
0. Retour au menu principal
`);
      const choice = await this.inputHandler.ask("Votre choix : ");
      if (choice === "BACK" || choice === "TIMEOUT") return;

      switch (choice) {
        case "1":
          await this.handleWithdraw();
          return;
        case "0":
          return;
        default:
          console.log("Choix invalide.");
      }
    }
  }

  private async transferMenu(): Promise<void> {
    while (true) {
      console.log(`
=== Menu Transfert ===
1. Entrer un numéro et un montant à transférer
0. Retour au menu principal
`);
      const choice = await this.inputHandler.ask("Votre choix : ");
      if (choice === "BACK" || choice === "TIMEOUT") return;

      switch (choice) {
        case "1":
          await this.handleTransfer();
          return;
        case "0":
          return;
        default:
          console.log("Choix invalide.");
      }
    }
  }

  private async handleRecharge(): Promise<void> {
    while (true) {
      const numero = await this.inputHandler.ask(
        "Numéro de téléphone (ou * pour annuler) : "
      );
      if (numero === "BACK" || numero === "TIMEOUT") return;

      const isValid = /^0[3-4][0-9]{8}$/.test(numero);
      if (!isValid) {
        console.log(
          "Numéro invalide. Format attendu : 03XXXXXXXX ou 04XXXXXXXX"
        );
        continue;
      }

      const amountStr = await this.inputHandler.ask(
        "Montant à recharger (ou * pour annuler) : "
      );
      if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log("Montant invalide.");
        continue;
      }

      this.account.add(amount);
      console.log(`Recharge de ${amount} unités effectuée.`);
      this.showBalance();
      await this.afterActionMenu();
      break;
    }
  }

  private async handleWithdraw(): Promise<void> {
    while (true) {
      const amountStr = await this.inputHandler.ask(
        "Montant à retirer (ou * pour annuler) : "
      );
      if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log("Montant invalide.");
        continue;
      }

      try {
        this.account.spend(amount);
        console.log(`Retrait de ${amount} unités effectué.`);
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
      const numero = await this.inputHandler.ask(
        "Numéro du destinataire (ou * pour annuler) : "
      );
      if (numero === "BACK" || numero === "TIMEOUT") return;

      const isValid = /^0[3-4][0-9]{8}$/.test(numero);
      if (!isValid) {
        console.log(
          "Numéro invalide. Format attendu : 03XXXXXXXX ou 04XXXXXXXX"
        );
        continue;
      }

      const amountStr = await this.inputHandler.ask(
        "Montant à transférer (ou * pour annuler) : "
      );
      if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log("Montant invalide.");
        continue;
      }

      try {
        this.account.spend(amount);
        console.log(`Transfert de ${amount} unités vers ${numero} effectué.`);
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
Que souhaitez-vous faire ?
1. Retour au menu principal
0. Quitter
`);
    const choice = await this.inputHandler.ask("Votre choix : ");
    if (choice === "0") {
      this.quit();
    }
  }

  private quit(): void {
    console.log("Merci d'avoir utilisé le service MyTel.");
    this.inputHandler.close();
    process.exit(0);
  }
}
