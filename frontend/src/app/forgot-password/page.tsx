"use client";

import Link from "next/link";
import { Bot, Mail, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 lg:px-16 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="rounded-xl bg-primary/10 p-2">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          ApplyGenie
        </Link>
      </header>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Title Text */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Password Recovery
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-[32px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-6 md:p-8">
            <form className="space-y-5">
              <div>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 rounded-xl pl-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all gap-2"
              >
                Send Reset Link
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/sign-in" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
