"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AtmIcon } from "@/components/atm-icon"
import type { User } from "@/lib/types"

interface DashboardHeaderProps {
  user: User
  onLogout: () => void
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/dashboard" className="flex items-center">
          <AtmIcon className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-semibold">ATM System</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm hidden md:block">
            Welcome, <span className="font-medium">{user.fullName}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
