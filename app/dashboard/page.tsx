"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserData, logout } from "@/lib/actions"
import { DashboardHeader } from "@/components/dashboard-header"
import { AccountBalance } from "@/components/account-balance"
import { WithdrawForm } from "@/components/withdraw-form"
import { DepositForm } from "@/components/deposit-form"
import { TransferForm } from "@/components/transfer-form"
import { TransactionHistory } from "@/components/transaction-history"
import { toast } from "@/hooks/use-toast"
import type { User, Account } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [account, setAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData()
        if (data.success) {
          setUser(data.user)
          setAccount(data.account)
        } else {
          toast({
            title: "Authentication error",
            description: "Please login to access the dashboard",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user || !account) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Session Expired</CardTitle>
            <CardDescription>Your session has expired or you are not logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} onLogout={handleLogout} />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AccountBalance account={account} />

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>ATM Services</CardTitle>
              <CardDescription>Manage your account and perform transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="withdraw" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="transfer">Transfer</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="withdraw">
                  <WithdrawForm
                    accountNumber={account.accountNumber}
                    onSuccess={(newBalance) => {
                      setAccount({ ...account, balance: newBalance })
                    }}
                  />
                </TabsContent>
                <TabsContent value="deposit">
                  <DepositForm
                    accountNumber={account.accountNumber}
                    onSuccess={(newBalance) => {
                      setAccount({ ...account, balance: newBalance })
                    }}
                  />
                </TabsContent>
                <TabsContent value="transfer">
                  <TransferForm
                    accountNumber={account.accountNumber}
                    onSuccess={(newBalance) => {
                      setAccount({ ...account, balance: newBalance })
                    }}
                  />
                </TabsContent>
                <TabsContent value="history">
                  <TransactionHistory accountNumber={account.accountNumber} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ATM Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
