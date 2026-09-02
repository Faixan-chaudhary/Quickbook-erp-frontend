import { accounts as initialAccounts, transactions as initialTransactions } from "@/data/mock";
import type { Account, Transaction } from "@/types";

let mockAccountsData: Account[] = [...initialAccounts];
let mockTransactionsData: Transaction[] = [...initialTransactions];

export async function getAccounts(): Promise<Account[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...mockAccountsData]), 100));
}

export async function getTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...mockTransactionsData]), 100));
}
