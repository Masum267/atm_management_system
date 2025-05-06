"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { depositFunds } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"

interface DepositFormProps {
  accountNumber: string
  onSuccess: (newBalance: number) => void
}

export function DepositForm({ accountNumber, onSuccess }: DepositFormProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await depositFunds({
        accountNumber,
        amount: Number.parseFloat(amount),
      })

      if (result.success) {
        toast({
          title: "Deposit successful",
          description: `$${Number.parseFloat(amount).toFixed(2)} has been deposited to your account`,
        })
        setAmount("")
        onSuccess(result.newBalance)
      } else {
        toast({
          title: "Deposit failed",
          description: result.error || "An error occurred during deposit",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deposit-amount">Deposit Amount</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">$</span>
          </div>
          <Input
            id="deposit-amount"
            type="number"
            placeholder="0.00"
            className="pl-7"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Deposit Funds"}
      </Button>
    </form>
  )
}
