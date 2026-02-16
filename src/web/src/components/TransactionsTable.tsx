import type { Transaction } from "../types";
import { Badge } from "./ui/badge";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const categoryColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Groceries": "default",
  "Utilities": "secondary",
  "Entertainment": "outline",
  "Shopping": "default",
  "Dining": "secondary",
  "Transportation": "outline",
  "Healthcare": "destructive",
  "Education": "default",
  "Income": "default",
  "Transfer": "secondary",
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Date
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Description
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Category
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Type
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="p-4 align-middle">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="p-4 align-middle">
                  <div className="font-medium">{transaction.description}</div>
                  {transaction.reference && (
                    <div className="text-xs text-muted-foreground">
                      Ref: {transaction.reference}
                    </div>
                  )}
                </td>
                <td className="p-4 align-middle">
                  <Badge variant={categoryColors[transaction.category] || "outline"}>
                    {transaction.category}
                  </Badge>
                </td>
                <td className="p-4 align-middle">
                  <span
                    className={
                      transaction.type === "Credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="p-4 align-middle text-right font-medium">
                  <span
                    className={
                      transaction.type === "Credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {transaction.type === "Credit" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
