'use client';

import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
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
    </div>
  );
}
