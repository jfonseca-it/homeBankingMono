import { useEffect, useState } from "react";
import type { Account, Transaction, TransferRequest } from "./types";
import { AccountCard } from "./components/AccountCard";
import { TransactionsTable } from "./components/TransactionsTable";
import { TransferForm } from "./components/TransferForm";
import { Wallet } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsRes, transactionsRes] = await Promise.all([
        fetch(`${API_URL}/api/accounts`),
        fetch(`${API_URL}/api/transactions`),
      ]);

      if (!accountsRes.ok || !transactionsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const accountsData = await accountsRes.json();
      const transactionsData = await transactionsRes.json();

      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (request: TransferRequest) => {
    const response = await fetch(`${API_URL}/api/transfers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Transfer failed");
    }

    // Refresh data after successful transfer
    await fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Home Banking</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Accounts Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </section>

          {/* Transfer Form Section */}
          <section>
            <div className="max-w-2xl">
              <TransferForm accounts={accounts} onTransfer={handleTransfer} />
            </div>
          </section>

          {/* Transactions Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <TransactionsTable transactions={transactions} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

