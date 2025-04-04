"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { AuthSession } from "@/types/auth";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthForm } from "./auth-form";

export function UserProfile() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await authClient.getSession();
        if (response && !(response instanceof Error)) {
          setSession(response.data);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }
    checkSession();
  }, []);

  async function handleSignOut() {
    try {
      await authClient.signOut();
      setSession(null);
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
          aria-label="User profile"
        >
          <UserCircle className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {session ? "Account" : "Sign in or create account"}
          </DialogTitle>
          <DialogDescription>
            {session
              ? "Manage your account settings"
              : "Sign in to your account or create a new one"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {session ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <UserCircle className="h-12 w-12" />
                <div>
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <AuthForm onSessionUpdate={setSession} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
