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
(Tapez * à tout moment pour revenir)
`);
      const choice = await this.inputHandler.ask("Votre choix : ");
      if (choice === "BACK" || choice === "TIMEOUT") continue;

      switch (choice) {
        case "1":
          this.showBalance();
          await this.afterActionMenu();
          break;
        case "2":
          await this.handleRecharge();
          break;
        case "3":
          await this.handleWithdraw();
          break;
        case "4":
          await this.handleTransfer();
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

  private async handleRecharge(): Promise<void> {
    const numero = await this.inputHandler.ask("Numéro de téléphone : ");
    if (numero === "BACK" || numero === "TIMEOUT") return;

    const isValid = /^0[3-4][0-9]{8}$/.test(numero);
    if (!isValid) {
      console.log("Numéro invalide. Format attendu : 03XXXXXXXX ou 04XXXXXXXX");
      return;
    }

    const amountStr = await this.inputHandler.ask("Montant à recharger : ");
    if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.log("Montant invalide.");
      return;
    }

    this.account.add(amount);
    console.log(`Recharge de ${amount} unités effectuée.`);
    this.showBalance();
    await this.afterActionMenu();
  }

  private async handleWithdraw(): Promise<void> {
    const amountStr = await this.inputHandler.ask("Montant à retirer : ");
    if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.log("Montant invalide.");
      return;
    }

    try {
      this.account.spend(amount);
      console.log(`Retrait de ${amount} unités effectué.`);
      this.showBalance();
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }

    await this.afterActionMenu();
  }

  private async handleTransfer(): Promise<void> {
    const numero = await this.inputHandler.ask("Numéro du destinataire : ");
    if (numero === "BACK" || numero === "TIMEOUT") return;

    const isValid = /^0[3-4][0-9]{8}$/.test(numero);
    if (!isValid) {
      console.log("Numéro invalide. Format attendu : 03XXXXXXXX ou 04XXXXXXXX");
      return;
    }

    const amountStr = await this.inputHandler.ask("Montant à transférer : ");
    if (amountStr === "BACK" || amountStr === "TIMEOUT") return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.log("Montant invalide.");
      return;
    }

    try {
      this.account.spend(amount);
      console.log(`Transfert de ${amount} unités vers ${numero} effectué.`);
      this.showBalance();
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }

    await this.afterActionMenu();
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
