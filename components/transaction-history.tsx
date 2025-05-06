"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getTransactionHistory } from "@/lib/actions"
import type { Transaction } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface TransactionHistoryProps {
  accountNumber: string
}

export function TransactionHistory({ accountNumber }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await getTransactionHistory(accountNumber)
        if (result.success) {
          setTransactions(result.transactions)
        } else {
          toast({
            title: "Failed to load transactions",
            description: result.error || "An error occurred",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [accountNumber])

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No transaction history found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                  transaction.type === "deposit"
                    ? "bg-green-100 text-green-600"
                    : transaction.type === "withdraw"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {transaction.type === "deposit" && "+"}
                {transaction.type === "withdraw" && "-"}
                {transaction.type === "transfer" && "↔"}
              </div>
              <div className="flex-1">
                <div className="font-medium capitalize">
                  {transaction.type}
                  {transaction.type === "transfer" && transaction.toAccount && ` to ${transaction.toAccount}`}
                </div>
                <div className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleString()}</div>
              </div>
              <div
                className={`font-medium ${
                  transaction.type === "deposit"
                    ? "text-green-600"
                    : transaction.type === "withdraw"
                      ? "text-red-600"
                      : ""
                }`}
              >
                {transaction.type === "deposit" && "+"}
                {transaction.type === "withdraw" && "-"}${transaction.amount.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
