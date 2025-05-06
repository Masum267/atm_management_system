export interface User {
  id: string
  username: string
  fullName: string
}

export interface Account {
  accountNumber: string
  userId: string
  balance: number
}

export interface Transaction {
  id: string
  accountNumber: string
  type: "deposit" | "withdraw" | "transfer"
  amount: number
  date: string
  toAccount?: string
}
