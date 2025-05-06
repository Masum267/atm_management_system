import mysql from "mysql2/promise"

// Database connection configuration
export async function getConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "atm_system",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    })

    return connection
  } catch (error) {
    console.error("Failed to create database connection:", error)
    throw new Error("Database connection failed")
  }
}

// Helper function to execute SQL queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  const connection = await getConnection()
  try {
    const [results] = await connection.execute(query, params)
    return results as T
  } catch (error) {
    console.error("Query execution error:", error)
    throw error
  } finally {
    await connection.end()
  }
}
