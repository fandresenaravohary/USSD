import { Account } from './models/account';
import { UssdService } from './services/ussdService';

async function main(): Promise<void> {
  const account = new Account(100);
  const ussdService = new UssdService(account);
  await ussdService.startSession();
}

main();
