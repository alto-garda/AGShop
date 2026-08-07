"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center">

      <Card className="w-full rounded-3xl border-2 p-6">

        <h1 className="mb-6 text-center text-3xl font-bold">
          AGShop
        </h1>

        <div className="space-y-4">

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="h-14 w-full rounded-2xl bg-[#1668E8]"
            onClick={login}
          >
            Accedi
          </Button>

        </div>

      </Card>

    </div>
  );
}
