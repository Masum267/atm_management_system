"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { transferFunds } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"

interface TransferFormProps {
  accountNumber: string
  onSuccess: (newBalance: number) => void
}

export function TransferForm({ accountNumber, onSuccess }: TransferFormProps) {
  const [formData, setFormData] = useState({
    toAccount: "",
    amount: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to transfer",
        variant: "destructive",
      })
      return
    }

    if (!formData.toAccount) {
      toast({
        title: "Missing recipient",
        description: "Please enter a recipient account number",
        variant: "destructive",
      })
      return
    }

    if (formData.toAccount === accountNumber) {
      toast({
        title: "Invalid recipient",
        description: "You cannot transfer funds to your own account",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await transferFunds({
        fromAccount: accountNumber,
        toAccount: formData.toAccount,
        amount: Number.parseFloat(formData.amount),
      })

      if (result.success) {
        toast({
          title: "Transfer successful",
          description: `$${Number.parseFloat(formData.amount).toFixed(2)} has been transferred to account #${formData.toAccount}`,
        })
        setFormData({
          toAccount: "",
          amount: "",
        })
        onSuccess(result.newBalance)
      } else {
        toast({
          title: "Transfer failed",
          description: result.error || "An error occurred during transfer",
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
        <Label htmlFor="toAccount">Recipient Account Number</Label>
        <Input
          id="toAccount"
          name="toAccount"
          placeholder="Enter recipient account number"
          value={formData.toAccount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="transfer-amount">Transfer Amount</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">$</span>
          </div>
          <Input
            id="transfer-amount"
            name="amount"
            type="number"
            placeholder="0.00"
            className="pl-7"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Transfer Funds"}
      </Button>
    </form>
  )
}
