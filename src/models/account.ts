export class Account {
  private balance: number;

  constructor(initialBalance = 0) {
    this.balance = initialBalance;
  }

  checkBalance(): number {
    return this.balance;
  }

  add(amount: number): void {
    this.balance += amount;
  }

  spend(amount: number): void {
    if (amount > this.balance) {
      throw new Error("Solde insuffisant.");
    }
    this.balance -= amount;
  }
}
