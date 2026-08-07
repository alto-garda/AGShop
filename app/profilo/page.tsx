"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, Mail, LogOut } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfiloPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? "");
    }

    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">

      <Card className="rounded-3xl border-2 p-6">

        <div className="flex flex-col items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1668E8]/10">
            <UserRound className="h-12 w-12 text-[#1668E8]" />
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold">
            Profilo
          </h1>

          <div className="mt-8 flex w-full items-center gap-3 rounded-2xl border-2 p-4">

            <Mail className="text-[#1668E8]" />

            <div>
              <p className="text-xs text-slate-500">
                Email
              </p>

              <p className="font-medium">
                {email}
              </p>
            </div>

          </div>

        </div>

      </Card>

      <Button
        variant="destructive"
        className="h-14 justify-start rounded-2xl"
        onClick={logout}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>

    </div>
  );
}
