"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  Landmark,
} from "lucide-react";

import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";

type MetodoPagamento =
  | "contanti"
  | "pos"
  | "bonifico";

export function SegnaPagato({
  ordineId,
}: {
  ordineId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  async function segnaPagato(
    metodo: MetodoPagamento
  ) {
    if (saving) return;

    setSaving(true);

    const { error } = await supabase
      .from("ordini")
      .update({
        metodo_pagamento: metodo,
      })
      .eq("id", ordineId);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">
        Segna pagamento
      </p>

      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => segnaPagato("contanti")}
          disabled={saving}
          className="h-14 rounded-2xl"
        >
          <Banknote className="mr-2 h-5 w-5" />
          Contanti
        </Button>

        <Button
          onClick={() => segnaPagato("pos")}
          disabled={saving}
          className="h-14 rounded-2xl"
        >
          <CreditCard className="mr-2 h-5 w-5" />
          POS
        </Button>

        <Button
          onClick={() => segnaPagato("bonifico")}
          disabled={saving}
          className="h-14 rounded-2xl"
        >
          <Landmark className="mr-2 h-5 w-5" />
          Bonifico
        </Button>
      </div>
    </div>
  );
}
