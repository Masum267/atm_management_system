import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AtmIcon } from "@/components/atm-icon"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <AtmIcon className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-semibold">ATM System</span>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Modern ATM Management System
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  A secure and efficient way to manage your banking operations. Access your accounts, make transactions,
                  and track your financial activities.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/login">
                    <Button size="lg">Login to Account</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="lg">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                    <CardDescription>Everything you need for modern banking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Secure user authentication</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Account balance inquiries</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Cash withdrawals and deposits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Fund transfers between accounts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Transaction history tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      Built with modern security standards to protect your financial data
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ATM Management System. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
