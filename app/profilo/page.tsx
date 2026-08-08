"use client";

import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  LogOut,
  User,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfiloPage() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("nome, cognome, email")
        .eq("id", user.id)
        .single();

      if (profile) {
        setNome(profile.nome ?? "");
        setCognome(profile.cognome ?? "");
        setEmail(profile.email ?? user.email ?? "");
      } else {
        setEmail(user.email ?? "");
      }
    }

    loadProfile();
  }, []);

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Errore logout:", error);
      setLoggingOut(false);
      return;
    }

    window.location.href = "/login";
  }

  const nomeCompleto = [nome, cognome]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-4">

      <Card className="rounded-3xl border-2 p-6">
        <div className="flex flex-col items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1668E8]/10">
            <UserRound className="h-12 w-12 text-[#1668E8]" />
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold">
            {nomeCompleto || "Profilo"}
          </h1>

          <div className="mt-7 w-full space-y-2">

            <div className="flex items-center gap-3 rounded-2xl border-2 p-4">
              <User className="h-5 w-5 shrink-0 text-[#1668E8]" />

              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nome
                </p>
                <p className="font-medium">
                  {nome || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border-2 p-4">
              <User className="h-5 w-5 shrink-0 text-[#1668E8]" />

              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cognome
                </p>
                <p className="font-medium">
                  {cognome || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border-2 p-4">
              <Mail className="h-5 w-5 shrink-0 text-[#1668E8]" />

              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Email
                </p>
                <p className="break-all font-medium">
                  {email || "—"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </Card>

      <Button
        variant="destructive"
        className="h-14 w-full justify-center rounded-2xl font-semibold"
        onClick={logout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Uscita...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </>
        )}
      </Button>

    </div>
  );
}
