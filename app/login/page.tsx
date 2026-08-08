"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email || !password || loading) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full rounded-3xl border-2 p-6">

        <h1 className="mb-2 text-center text-3xl font-bold">
          AGShop
        </h1>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          ASD Alto Garda
        </p>

        <div className="space-y-4">

          <Input
            placeholder="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            className="h-14 w-full rounded-2xl bg-[#1668E8] hover:bg-[#0F5BD6]"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Accesso..." : "Accedi"}
          </Button>

        </div>

      </Card>
    </div>
  );
}
