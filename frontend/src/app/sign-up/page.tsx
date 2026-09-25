"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Signup result:", data);

      if (!res.ok) {
        setError(
          data.message || "Unable to create your account."
        );
        return;
      }

      setSuccess(
        "Account created successfully! You can now sign in."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">

      {/* ==================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Top teal glow */}
        <div
          className="
            absolute
            left-1/2
            top-[-250px]
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-teal-500/10
            blur-[120px]
          "
        />

        {/* Bottom left glow */}
        <div
          className="
            absolute
            bottom-[-200px]
            left-[-100px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-blue-500/5
            blur-[100px]
          "
        />

        {/* Right glow */}
        <div
          className="
            absolute
            right-[-100px]
            top-[30%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-teal-400/5
            blur-[100px]
          "
        />

      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-10
        "
      >

        <div className="w-full max-w-md">

          {/* ==================================================
              LOGO / BRAND
          ================================================== */}

          <div className="mb-8 text-center">

            <div
              className="
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
              "
            >
              <Sparkles
                size={25}
                className="text-teal-400"
              />
            </div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
              "
            >
              Create your account
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-zinc-500
              "
            >
              Create an account to get started
            </p>

          </div>

          {/* ==================================================
              SIGN UP CARD
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900/80
              p-6
              shadow-2xl
              shadow-black/20
              backdrop-blur-xl
              sm:p-8
            "
          >

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-4
                  py-3
                  text-sm
                  text-red-400
                "
              >
                {error}
              </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-teal-500/20
                  bg-teal-500/10
                  px-4
                  py-3
                  text-sm
                  text-teal-400
                "
              >
                {success}
              </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ==================================================
                  NAME
              ================================================== */}

              <div>

                <label
                  htmlFor="name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  Full name
                </label>

                <div className="relative">

                  <User
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
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    disabled={loading}
                    autoComplete="name"
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

              {/* ==================================================
                  EMAIL
              ================================================== */}

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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
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

              {/* ==================================================
                  PASSWORD
              ================================================== */}

              <div>

                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  Password
                </label>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    disabled={loading}
                    autoComplete="new-password"
                    minLength={6}
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

                <p
                  className="
                    mt-2
                    text-xs
                    text-zinc-600
                  "
                >
                  Password must be at least 6 characters.
                </p>

              </div>

              {/* ==================================================
                  SUBMIT BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.name.trim() ||
                  !formData.email.trim() ||
                  !formData.password.trim()
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

                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>

            {/* ==================================================
                SIGN IN
            ================================================== */}

            <p
              className="
                mt-6
                text-center
                text-sm
                text-zinc-500
              "
            >
              Already have an account?{" "}

              <Link
                href="/sign-in"
                className="
                  font-medium
                  text-teal-400
                  transition
                  hover:text-teal-300
                "
              >
                Sign in
              </Link>
            </p>

          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <p
            className="
              mt-6
              text-center
              text-xs
              text-zinc-600
            "
          >
            By creating an account, you agree to our{" "}

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