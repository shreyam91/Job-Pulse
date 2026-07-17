"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bot,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10">

      {/* Decorative Blobs */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl" />

      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 lg:px-16 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="rounded-xl bg-primary/10 p-2">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          ApplyGenie
        </Link>

        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </div>
      </header>

      <div className="relative flex min-h-screen">
        {/* LEFT */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">

            {/* Title Text */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary text-sm font-medium mb-3">
                <Sparkles className="h-4 w-4" />
                Welcome Back
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                Sign in
              </h1>

              <p className="mt-1 text-muted-foreground text-lg">
                Continue managing your applications and let AI help you land your next opportunity.
              </p>
            </div>

            {/* Auth Card */}
            <div className="rounded-[32px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-6">

              {/* Social */}

              <div className="space-y-3">

                <Button
                  variant="outline"
                  className="h-12 w-full rounded-xl justify-center gap-3 hover:bg-muted transition"
                >

                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>

                  Continue with Google

                </Button>

              </div>

              <div className="relative my-4">

                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>

                <div className="relative flex justify-center">

                  <span className="bg-background px-4 text-xs uppercase text-muted-foreground">
                    Or continue with email
                  </span>

                </div>

              </div>

                            <form className="space-y-5">

                {/* Email */}

                <div>

                  {/* <label className="text-sm font-medium">
                    Email address
                  </label> */}

                  <div className="relative mt-2">

                    <Mail
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        h-5
                        w-5
                        text-muted-foreground
                      "
                    />

                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="
                        h-12
                        rounded-xl
                        pl-12
                      "
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <div className="flex items-center justify-between">

                    {/* <label className="text-sm font-medium">
                      Password
                    </label> */}

                    

                  </div>

                  <div className="relative mt-">

                    <Lock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        h-5
                        w-5
                        text-muted-foreground
                      "
                    />

                    <Input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="••••••••"
                      className="
                        h-12
                        rounded-xl
                        pl-12
                        pr-12
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        hover:text-foreground
                        transition
                      "
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>

                  </div>

                  <Link
                      href="/forgot-password"
                      className="
                        text-sm
                        text-primary
                        hover:underline
                      "
                    >
                      Forgot password?
                    </Link>

                </div>


                {/* Submit */}
                  <Button
                    render={<Link href="/dashboard" className="block" />}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      text-base
                      font-semibold
                      shadow-lg
                      hover:shadow-xl
                      transition-all
                      gap-2
                    "
                  >
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </Button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div
          className="
            hidden
            lg:flex
            w-1/2
            items-center
            justify-center
            p-16
            relative
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-primary/15
              via-primary/5
              to-transparent
            "
          />

          <div className="relative z-10 w-full max-w-lg">

                        <div
              className="
                rounded-[32px]
                border
                border-border/50
                bg-background/70
                backdrop-blur-2xl
                shadow-2xl
                p-4
                relative
              "
            >
              {/* Quote */}

              <div className="text-7xl font-serif text-primary/20 leading-none">
                "
              </div>

              <h2 className="mt- text-3xl font-bold leading-tight">
                ApplyGenie completely changed how I applied for jobs.
              </h2>

              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Instead of spending hours tailoring resumes and writing cover
                letters, I focused on interviews. The AI handled the repetitive
                work and helped me increase recruiter responses by over
                <span className="font-semibold text-foreground">
                  {" "}
                  40%.
                </span>
              </p>

              {/* User */}

              <div className="mt-10 flex items-center gap-4">

                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  SK
                </div>

                <div>
                  <h3 className="font-semibold">
                    Shreyam Kanaujiya
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Software Engineer 
                  </p>
                </div>

              </div>


              {/* Floating Card */}

              <div
                className="
                  absolute
                  -bottom-12
                  -right-18
                  rounded-2xl
                  border
                  bg-background
                  shadow-xl
                  p-5
                  flex
                  items-center
                  gap-4
                "
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">

                  <CheckCircle2 className="h-6 w-6 text-green-600" />

                </div>

                <div>

                  <p className="font-semibold">
                    Resume Optimized
                  </p>

                  <p className="text-sm text-muted-foreground">
                    AI increased ATS score to 94%
                  </p>

                </div>

              </div>

               <div
                className="
                  absolute
                  -top-12
                  -right-18
                  rounded-2xl
                  border
                  bg-background
                  shadow-xl
                  p-5
                  flex
                  items-center
                  gap-4
                "
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">

                  <CheckCircle2 className="h-6 w-6 text-blue-600" />

                </div>

                <div>

                  <p className="font-semibold">
                    Application Sent
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Your resume has 90+ ATS score for this job post.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}