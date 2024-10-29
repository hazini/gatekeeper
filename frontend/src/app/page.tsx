"use client"

import React from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/Sidebar"

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Gatekeeper App</CardTitle>
              <CardDescription>Organize and manage your licenses with ease</CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <p>You are logged in. Start managing your licenses!</p>
                  <div className="flex space-x-4">
                    <Button asChild>
                      <Link href="/licenses">View licenses</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Please log in.</p>
                  <Button asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
