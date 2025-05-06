"use server"

import { cookies } from "next/headers"
import { executeQuery } from "./db"
import bcrypt from "bcryptjs"

// Authentication actions
export async function registerUser(userData: {
  fullName: string
  username: string
  pin: string
}) {
  try {
    // Check if username already exists
    const existingUsers = await executeQuery<any[]>("SELECT * FROM users WHERE username = ?", [userData.username])

    if (existingUsers.length > 0) {
      return { success: false, error: "Username already exists" }
    }

    // Hash the PIN
    const hashedPin = await bcrypt.hash(userData.pin, 10)

    // Create new user in a transaction
    const connection = await (await import("./db")).getConnection()
    await connection.beginTransaction()

    try {
      // Insert user
      const [userResult] = await connection.execute("INSERT INTO users (username, pin, full_name) VALUES (?, ?, ?)", [
        userData.username,
        hashedPin,
        userData.fullName,
      ])

      const userId = (userResult as any).insertId

      // Create account for user
      await connection.execute("INSERT INTO accounts (user_id, balance) VALUES (?, ?)", [userId, 0])

      await connection.commit()
      await connection.end()

      return { success: true, userId }
    } catch (error) {
      await connection.rollback()
      await connection.end()
      console.error("Transaction error:", error)
      return { success: false, error: "Registration failed" }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed" }
  }
}

export async function loginUser(credentials: {
  username: string
  pin: string
}) {
  try {
    // Get user from database
    const users = await executeQuery<any[]>("SELECT * FROM users WHERE username = ?", [credentials.username])

    if (users.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = users[0]

    // Verify PIN
    const isValidPin = await bcrypt.compare(credentials.pin, user.pin)

    if (!isValidPin) {
      return { success: false, error: "Invalid credentials" }
    }

    // Set a cookie for authentication
    cookies().set("userId", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username,
        fullName: user.full_name,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed" }
  }
}

export async function logout() {
  cookies().delete("userId")
}

export async function getUserData() {
  try {
    const userId = cookies().get("userId")?.value

    if (!userId) {
      return { success: false, error: "Not authenticated" }
    }

    // Get user data
    const users = await executeQuery<any[]>("SELECT id, username, full_name FROM users WHERE id = ?", [userId])

    if (users.length === 0) {
      return { success: false, error: "User not found" }
    }

    const user = users[0]

    // Get account data
    const accounts = await executeQuery<any[]>(
      "SELECT account_number, user_id, balance FROM accounts WHERE user_id = ?",
      [userId],
    )

    if (accounts.length === 0) {
      return { success: false, error: "Account not found" }
    }

    const account = accounts[0]

    return {
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username,
        fullName: user.full_name,
      },
      account: {
        accountNumber: account.account_number.toString(),
        userId: account.user_id.toString(),
        balance: Number.parseFloat(account.balance),
      },
    }
  } catch (error) {
    console.error("Get user data error:", error)
    return { success: false, error: "Failed to get user data" }
  }
}

// Transaction actions
export async function withdrawFunds({
  accountNumber,
  amount,
}: {
  accountNumber: string
  amount: number
}) {
  try {
    const connection = await (await import("./db")).getConnection()
    await connection.beginTransaction()

    try {
      // Check account balance
      const [accounts] = await connection.execute("SELECT balance FROM accounts WHERE account_number = ?", [
        accountNumber,
      ])

      const accountsArray = accounts as any[]
      if (accountsArray.length === 0) {
        await connection.rollback()
        await connection.end()
        return { success: false, error: "Account not found" }
      }

      const balance = Number.parseFloat(accountsArray[0].balance)
      if (balance < amount) {
        await connection.rollback()
        await connection.end()
        return { success: false, error: "Insufficient funds" }
      }

      // Update account balance
      await connection.execute("UPDATE accounts SET balance = balance - ? WHERE account_number = ?", [
        amount,
        accountNumber,
      ])

      // Record transaction
      await connection.execute("INSERT INTO transactions (account_number, transaction_type, amount) VALUES (?, ?, ?)", [
        accountNumber,
        "withdraw",
        amount,
      ])

      await connection.commit()

      // Get updated balance
      const [updatedAccounts] = await connection.execute("SELECT balance FROM accounts WHERE account_number = ?", [
        accountNumber,
      ])

      const updatedAccountsArray = updatedAccounts as any[]
      const newBalance = Number.parseFloat(updatedAccountsArray[0].balance)

      await connection.end()
      return { success: true, newBalance }
    } catch (error) {
      await connection.rollback()
      await connection.end()
      console.error("Transaction error:", error)
      return { success: false, error: "Withdrawal failed" }
    }
  } catch (error) {
    console.error("Withdrawal error:", error)
    return { success: false, error: "Withdrawal failed" }
  }
}

export async function depositFunds({
  accountNumber,
  amount,
}: {
  accountNumber: string
  amount: number
}) {
  try {
    const connection = await (await import("./db")).getConnection()
    await connection.beginTransaction()

    try {
      // Check if account exists
      const [accounts] = await connection.execute("SELECT account_number FROM accounts WHERE account_number = ?", [
        accountNumber,
      ])

      const accountsArray = accounts as any[]
      if (accountsArray.length === 0) {
        await connection.rollback()
        await connection.end()
        return { success: false, error: "Account not found" }
      }

      // Update account balance
      await connection.execute("UPDATE accounts SET balance = balance + ? WHERE account_number = ?", [
        amount,
        accountNumber,
      ])

      // Record transaction
      await connection.execute("INSERT INTO transactions (account_number, transaction_type, amount) VALUES (?, ?, ?)", [
        accountNumber,
        "deposit",
        amount,
      ])

      await connection.commit()

      // Get updated balance
      const [updatedAccounts] = await connection.execute("SELECT balance FROM accounts WHERE account_number = ?", [
        accountNumber,
      ])

      const updatedAccountsArray = updatedAccounts as any[]
      const newBalance = Number.parseFloat(updatedAccountsArray[0].balance)

      await connection.end()
      return { success: true, newBalance }
    } catch (error) {
      await connection.rollback()
      await connection.end()
      console.error("Transaction error:", error)
      return { success: false, error: "Deposit failed" }
    }
  } catch (error) {
    console.error("Deposit error:", error)
    return { success: false, error: "Deposit failed" }
  }
}

export async function transferFunds({
  fromAccount,
  toAccount,
  amount,
}: {
  fromAccount: string
  toAccount: string
  amount: number
}) {
  try {
    const connection = await (await import("./db")).getConnection()
    await connection.beginTransaction()

    try {
      // Check if source account exists and has sufficient funds
      const [sourceAccounts] = await connection.execute("SELECT balance FROM accounts WHERE account_number = ?", [
        fromAccount,
      ])

      const sourceAccountsArray = sourceAccounts as any[]
      if (sourceAccountsArray.length === 0) {
        await connection.rollback()
        await connection.end()
        return { success: false, error: "Source account not found" }
      }

      const sourceBalance = Number.parseFloat(sourceAccountsArray[0].balance)
      if (sourceBalance < amount) {
        await connection.rollback()
        await connection.end()
        return { success: false, error: "Insufficient funds" }
      }

      // Check if destination account exists
      const [destAccounts] = await connection.execute("SELECT account_number FROM accounts WHERE account_number = ?", [
        toAccount,
      ])

      const destAccountsArray = destAccounts as any[]
      if (destAccountsArray.length === 0) {
        await connection.rollback()
        await connection.end()
        return { success: false, error: "Destination account not found" }
      }

      // Update source account balance
      await connection.execute("UPDATE accounts SET balance = balance - ? WHERE account_number = ?", [
        amount,
        fromAccount,
      ])

      // Update destination account balance
      await connection.execute("UPDATE accounts SET balance = balance + ? WHERE account_number = ?", [
        amount,
        toAccount,
      ])

      // Record transaction
      await connection.execute(
        "INSERT INTO transactions (account_number, transaction_type, amount, to_account) VALUES (?, ?, ?, ?)",
        [fromAccount, "transfer", amount, toAccount],
      )

      await connection.commit()

      // Get updated balance
      const [updatedAccounts] = await connection.execute("SELECT balance FROM accounts WHERE account_number = ?", [
        fromAccount,
      ])

      const updatedAccountsArray = updatedAccounts as any[]
      const newBalance = Number.parseFloat(updatedAccountsArray[0].balance)

      await connection.end()
      return { success: true, newBalance }
    } catch (error) {
      await connection.rollback()
      await connection.end()
      console.error("Transaction error:", error)
      return { success: false, error: "Transfer failed" }
    }
  } catch (error) {
    console.error("Transfer error:", error)
    return { success: false, error: "Transfer failed" }
  }
}

export async function getTransactionHistory(accountNumber: string) {
  try {
    const transactions = await executeQuery<any[]>(
      `SELECT 
        id, 
        account_number, 
        transaction_type, 
        amount, 
        created_at as date,
        to_account
      FROM transactions 
      WHERE account_number = ? 
      ORDER BY created_at DESC`,
      [accountNumber],
    )

    return {
      success: true,
      transactions: transactions.map((t) => ({
        id: t.id.toString(),
        accountNumber: t.account_number.toString(),
        type: t.transaction_type,
        amount: Number.parseFloat(t.amount),
        date: t.date,
        toAccount: t.to_account ? t.to_account.toString() : undefined,
      })),
    }
  } catch (error) {
    console.error("Get transactions error:", error)
    return { success: false, error: "Failed to get transactions" }
  }
}
