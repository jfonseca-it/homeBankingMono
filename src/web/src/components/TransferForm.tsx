import { useState } from "react";
import type { Account, TransferRequest } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface TransferFormProps {
  accounts: Account[];
  onTransfer: (request: TransferRequest) => Promise<void>;
}

export function TransferForm({ accounts, onTransfer }: TransferFormProps) {
  const [fromAccountId, setFromAccountId] = useState<number>(0);
  const [toAccountId, setToAccountId] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!fromAccountId || !toAccountId) {
      setError("Please select both accounts");
      return;
    }

    if (fromAccountId === toAccountId) {
      setError("Cannot transfer to the same account");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }

    const fromAccount = accounts.find((a) => a.id === fromAccountId);
    if (fromAccount && fromAccount.balance < amountNum) {
      setError("Insufficient funds");
      return;
    }

    try {
      setLoading(true);
      await onTransfer({
        fromAccountId,
        toAccountId,
        amount: amountNum,
        description: description.trim(),
      });
      setSuccess(true);
      // Reset form
      setFromAccountId(0);
      setToAccountId(0);
      setAmount("");
      setDescription("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Transfer</CardTitle>
        <CardDescription>
          Transfer funds between your accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from-account">From Account</Label>
            <select
              id="from-account"
              value={fromAccountId}
              onChange={(e) => setFromAccountId(parseInt(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value={0}>Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountHolder} - {account.accountNumber} (${account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-account">To Account</Label>
            <select
              id="to-account"
              value={toAccountId}
              onChange={(e) => setToAccountId(parseInt(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value={0}>Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountHolder} - {account.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter transfer description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive font-medium">{error}</div>
          )}

          {success && (
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
              Transfer completed successfully!
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
