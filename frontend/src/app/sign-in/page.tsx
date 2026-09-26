"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Login result:", result);

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password."
            : result.error
        );

        return;
      }

      console.log("Login successful");

      // Redirect after successful login

      router.push('/')

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Google login error:", error);

      setError(
        "Unable to continue with Google."
      );

      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">

      {/* ================================================
          BACKGROUND EFFECTS
      ================================================= */}

      <div className="pointer-events-none absolute inset-0">

        <div className="
          absolute
          left-1/2
          top-[-250px]
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-teal-500/10
          blur-[120px]
        " />

        <div className="
          absolute
          bottom-[-200px]
          left-[-100px]
          h-[400px]
          w-[400px]
          rounded-full
          bg-blue-500/5
          blur-[100px]
        " />

        <div className="
          absolute
          right-[-100px]
          top-[30%]
          h-[350px]
          w-[350px]
          rounded-full
          bg-teal-400/5
          blur-[100px]
        " />

      </div>

      {/* ================================================
          CONTENT
      ================================================= */}

      <div className="
        relative
        z-10
        flex
        min-h-screen
        items-center
        justify-center
        px-4
        py-10
      ">

        <div className="w-full max-w-md">

          {/* ============================================
              LOGO / BRAND
          ============================================= */}

          <div className="mb-8 text-center">

            <div className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-teal-500/20
              bg-teal-500/10
              shadow-lg
              shadow-teal-500/5
            ">
              <Sparkles
                size={25}
                className="text-teal-400"
              />
            </div>

            <h1 className="
              text-3xl
              font-bold
              tracking-tight
              text-white
            ">
              Welcome back
            </h1>

            <p className="
              mt-2
              text-sm
              text-zinc-500
            ">
              Sign in to continue to your account
            </p>

          </div>

          {/* ============================================
              LOGIN CARD
          ============================================= */}

          <div className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900/80
            p-6
            shadow-2xl
            shadow-black/20
            backdrop-blur-xl
            sm:p-8
          ">

            {/* ==========================================
                ERROR
            =========================================== */}

            {error && (
              <div className="
                mb-5
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-400
              ">
                {error}
              </div>
            )}

            {/* ==========================================
                GOOGLE
            =========================================== */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-zinc-700
                bg-zinc-800/80
                px-4
                py-3
                text-sm
                font-medium
                text-zinc-100
                transition
                hover:border-zinc-600
                hover:bg-zinc-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {/* Google icon */}

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.16c1.85-1.7 2.9-4.2 2.9-7.42Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 21.5c2.65 0 4.87-.88 6.49-2.38l-3.16-2.45c-.88.59-2.01.94-3.33.94-2.56 0-4.73-1.73-5.51-4.06H3.22V16.1A9.8 9.8 0 0 0 12 21.5Z"
                  fill="#34A853"
                />
                <path
                  d="M6.49 13.55a5.9 5.9 0 0 1 0-3.77V7.33H3.22a9.5 9.5 0 0 0 0 8.67l3.27-2.45Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.72c1.45 0 2.75.5 3.77 1.49l2.82-2.82C16.87 2.8 14.65 1.9 12 1.9a9.8 9.8 0 0 0-8.78 5.43l3.27 2.45C7.27 7.45 9.44 5.72 12 5.72Z"
                  fill="#EA4335"
                />
              </svg>

              Continue with Google

            </button>

            {/* ==========================================
                DIVIDER
            =========================================== */}

            <div className="
              my-6
              flex
              items-center
              gap-4
            ">

              <div className="h-px flex-1 bg-zinc-800" />

              <span className="
                text-xs
                uppercase
                tracking-wider
                text-zinc-600
              ">
                Or continue with email
              </span>

              <div className="h-px flex-1 bg-zinc-800" />

            </div>

            {/* ==========================================
                FORM
            =========================================== */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-zinc-500
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    disabled={loading}
                    autoComplete="email"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-950
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      text-zinc-100
                      outline-none
                      transition

                      placeholder:text-zinc-600

                      focus:border-teal-500
                      focus:ring-2
                      focus:ring-teal-500/10

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="
                  mb-2
                  flex
                  items-center
                  justify-between
                ">

                  <label
                    htmlFor="password"
                    className="
                      text-sm
                      font-medium
                      text-zinc-300
                    "
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="
                      text-xs
                      text-teal-400
                      transition
                      hover:text-teal-300
                    "
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <Lock
                    size={18}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-zinc-500
                    "
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    disabled={loading}
                    autoComplete="current-password"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-950
                      py-3
                      pl-11
                      pr-12
                      text-sm
                      text-zinc-100
                      outline-none
                      transition

                      placeholder:text-zinc-600

                      focus:border-teal-500
                      focus:ring-2
                      focus:ring-teal-500/10

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1
                      text-zinc-500
                      transition
                      hover:text-zinc-200
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* ========================================
                  SUBMIT
              ========================================= */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !email.trim() ||
                  !password.trim()
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-teal-500
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-zinc-950
                  transition

                  hover:bg-teal-400

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>

            {/* ==========================================
                SIGN UP
            =========================================== */}

            <p className="
              mt-6
              text-center
              text-sm
              text-zinc-500">
              Don&apos;t have an account?{" "}

              <Link
                href="/sign-up"
                className="
                  font-medium
                  text-teal-400
                  transition
                  hover:text-teal-300
                "
              >
                Create account
              </Link>
            </p>

          </div>

          {/* ============================================
              FOOTER
          ============================================= */}

          <p className="
            mt-6
            text-center
            text-xs
            text-zinc-600
          ">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-zinc-400"
            >
              Terms
            </Link>
            {" "}and{" "}
            <Link
              href="/privacy"
              className="hover:text-zinc-400"
            >
              Privacy Policy
            </Link>
            .
          </p>

        </div>

      </div>
    </main>
  );
}