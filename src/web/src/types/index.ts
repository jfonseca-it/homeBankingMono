export interface Account {
  id: number;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  reference: string | null;
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description: string;
}
