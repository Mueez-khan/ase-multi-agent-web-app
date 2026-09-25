"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Menu,
  X,
  Home,
  MessageSquare,
  CreditCard,
  LogOut,
  User,
  ArrowRight,
} from "lucide-react";

function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/sign-in",
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 text-zinc-100 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10">
            <Sparkles size={18} className="text-teal-400" />
          </div>

          <span className="text-base font-bold text-white">
            SE
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <Home size={16} />
            Home
          </button>

          {/* ONLY AUTHENTICATED USERS */}
          {status === "authenticated" && (
            <button
              onClick={() => navigate("/conversations")}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <MessageSquare size={16} />
              Chat
            </button>
          )}

          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <CreditCard size={16} />
            Pricing
          </button>

        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">

          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-800" />
          ) : status === "authenticated" ? (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                  <User size={15} />
                </div>

                <span className="max-w-[140px] truncate text-sm text-zinc-300">
                  {session?.user?.name ||
                    session?.user?.email ||
                    "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/sign-in")}
              className="flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400"
            >
              Get started
              <ArrowRight size={16} />
            </button>
          )}

        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 md:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="space-y-2 px-4 py-4">

            <button
              onClick={() => navigate("/")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              <Home size={18} />
              Home
            </button>

            {/* ONLY AUTHENTICATED USERS */}
            {status === "authenticated" && (
              <button
                onClick={() => navigate("/conversations")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                <MessageSquare size={18} />
                Chat
              </button>
            )}

            <button
              onClick={() => navigate("/pricing")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              <CreditCard size={18} />
              Pricing
            </button>

            <div className="my-3 h-px bg-zinc-800" />

            {status === "authenticated" ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/sign-in")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-teal-400"
              >
                Get started
                <ArrowRight size={16} />
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;