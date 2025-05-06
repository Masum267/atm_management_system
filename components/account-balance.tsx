import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Account } from "@/lib/types"

interface AccountBalanceProps {
  account: Account
}

export function AccountBalance({ account }: AccountBalanceProps) {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Account Balance</CardTitle>
        <CardDescription>Account #{account.accountNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">${account.balance.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground mt-1">Available Balance</p>
      </CardContent>
    </Card>
  )
}
