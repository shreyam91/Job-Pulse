"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  FileText,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    {
      icon: FileText,
      title: "AI Resume Analysis",
      desc: "Instantly analyze your resume and improve ATS compatibility.",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      desc: "Find jobs that match your skills and experience.",
    },
    {
      icon: Sparkles,
      title: "AI Cover Letters",
      desc: "Generate personalized cover letters in seconds.",
    },
    {
      icon: TrendingUp,
      title: "Application Tracking",
      desc: "Manage every application from one dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-primary/10">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="rounded-xl bg-primary/10 p-2">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          ApplyGenie
        </Link>
      </header>

      <main className="min-h-screen grid lg:grid-cols-2">
        {/* LEFT */}
        <section className="flex mt-20 justify-center">
          <div className="w-full max-w-md">
            <div className="mb-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mt-1 text-muted-foreground text-lg">
                Start your AI-powered job search journey today.
              </p>
            </div>

            <Card className=" rounded-3xl border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-6">
              {/* Google */}
              <Button
                variant="outline"
                className=" h-12 w-full rounded-xl gap-3 hover:bg-muted transition-all "
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="my-2 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs text-muted-foreground">OR</span>

                <div className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  {/* <label className="text-sm font-medium">Full Name</label> */}

                  <div className="relative">
                    <User
                      className="
                      absolute
                      left-3
                      top-3.5
                      h-5
                      w-5
                      text-muted-foreground
                    "
                    />

                    <Input
                      placeholder="Jane Doe"
                      className="
                        h-12
                        rounded-xl
                        pl-10
                      "
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  {/* <label className="text-sm font-medium">Email Address</label> */}

                  <div className="relative">
                    <Mail
                      className="
                      absolute
                      left-3
                      top-3.5
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
                        pl-10
                      "
                    />
                  </div>
                </div>
                {/* Password */}
                <div className="space-y-2">
                  {/* <label className="text-sm font-medium">Password</label> */}

                  <div className="relative">
                    <Lock
                      className="
                        absolute
                        left-3
                        top-3.5
                        h-5
                        w-5
                        text-muted-foreground
                      "
                    />

                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="
                        h-12
                        rounded-xl
                        pl-10
                        pr-12
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                        absolute
                        right-3
                        top-3.5
                        text-muted-foreground
                        hover:text-foreground
                      "
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div
                  className="
                  flex
                  items-start
                  gap-3
                  text-sm
                  text-muted-foreground
                "
                >
                  <input
                    type="checkbox"
                    className="
                      mt-1
                      h-4
                      w-4
                      rounded
                      border-border
                    "
                  />

                  <p>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="
                        text-primary
                        hover:underline
                      "
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="
                        text-primary
                        hover:underline
                      "
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Submit */}
                  <Button
                    render={<Link href="/dashboard" className="block" />}
                    type="button"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      text-base
                      font-semibold
                      shadow-lg
                      transition-all
                      hover:scale-[1.02]
                      hover:shadow-xl
                      gap-2
                    "
                  >
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </Button>
              </form>

              {/* <div
                className="
                mt-
                flex
                items-center
                justify-center
                gap-2
                text-sm
                text-muted-foreground
              "
              >
                <ShieldCheck
                  className="
                    h-4
                    w-4
                    text-primary
                  "
                />
                Secure & encrypted signup
              </div> */}

              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className=" hidden lg:flex relative items-center justify-center overflow-hidden p-4 ">
          {/* Background */}
          <div
            className="
            absolute
            inset-0
            bg-gradient-to-br
            from-primary/20
            via-transparent
            to-accent/20
          "
          />

          <div
            className="
            absolute
            inset-0
            bg-[url('https://grainy-gradients.vercel.app/noise.svg')]
            opacity-20
          "
          />

          <div
            className="
            relative
            z-10
            w-full
            max-w-lg
          "
          >
            <div
              className="
              rounded-3xl
              border
              border-border/40
              bg-background/60
              backdrop-blur-2xl
              shadow-2xl
              p-4
            "
            >
              <div className="mb-2">
                <div
                  className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-primary/10
                  px-4
                  py-2
                  text-sm
                  text-primary
                  mb-2
                "
                >
                  <Sparkles className="h-4 w-4" />
                  AI Career Assistant
                </div>

                <h2
                  className="
                  text-3xl
                  font-bold
                  tracking-tight
                "
                >
                  Land your dream job faster
                </h2>

                <p
                  className="
                  
                  text-muted-foreground
                "
                >
                  Let AI optimize your resume, discover opportunities, and
                  improve your applications.
                </p>
              </div>

              {/* Resume Score Card */}

              <div
                className="
                rounded-2xl
                bg-background
                border
                shadow-xl
                p-5
                mb-2
                rotate-[-2deg]
                hover:rotate-0
                transition-all
              "
              >
                <div
                  className="
                  flex
                  justify-between
                  items-center
                "
                >
                  <div>
                    <p
                      className="
                      text-sm
                      text-muted-foreground
                    "
                    >
                      Resume Score
                    </p>

                    <p
                      className="
                      text-3xl
                      font-bold
                    "
                    >
                      94%
                    </p>
                  </div>

                  <div
                    className="
                    h-14
                    w-14
                    rounded-full
                    bg-primary/10
                    flex
                    items-center
                    justify-center
                  "
                  >
                    <CheckCircle2
                      className="
                        h-8
                        w-8
                        text-primary
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                  mt-4
                  h-2
                  rounded-full
                  bg-muted
                  overflow-hidden
                "
                >
                  <div
                    className="
                    h-full
                    w-[94%]
                    bg-green-500
                    rounded-full
                  "
                  />
                </div>
              </div>

              {/* Floating AI Cards */}

              <div
                className="
                grid
                grid-cols-2
                gap-4
                mt-4
              "
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={index}
                      className="
                        rounded-2xl
                        border
                        border-border/50
                        bg-background/70
                        backdrop-blur
                        p-2
                        hover:-translate-y-1
                        transition-all
                        duration-300
                      "
                    >
                      <div
                        className="
                        h-10
                        w-10
                        rounded-xl
                        bg-primary/10
                        flex
                        items-center
                        justify-center
                        mb-1
                      "
                      >
                        <Icon
                          className="
                            h-5
                            w-5
                            text-primary
                          "
                        />
                      </div>

                      <h3
                        className="
                        text-sm
                        font-semibold
                      "
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="
                        mt-1
                        text-xs
                        text-muted-foreground
                        leading-relaxed
                      "
                      >
                        {feature.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Trust Stats */}

              <div
                className="
                mt-1
                flex
                items-center
                justify-between
                rounded-2xl
                border
                bg-background/50
                p-3
              "
              >
                <div>
                  <p
                    className="
                    text-2xl
                    font-bold
                  "
                  >
                    20K+
                  </p>

                  <p
                    className="
                    text-xs
                    text-muted-foreground
                  "
                  >
                    Job seekers
                  </p>
                </div>

                <div
                  className="
                  h-10
                  w-px
                  bg-border
                "
                />

                <div>
                  <p
                    className="
                    text-2xl
                    font-bold
                  "
                  >
                    4.6 ★
                  </p>

                  <p
                    className="
                    text-xs
                    text-muted-foreground
                  "
                  >
                    User rating
                  </p>
                </div>

                <div className=" h-10 w-px bg-border "/>

                <div>
                  <p className="text-2xl font-bold">95%</p>

                  <p className="text-xs text-muted-foreground ">ATS success</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
