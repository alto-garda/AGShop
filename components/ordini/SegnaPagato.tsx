"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Check,
  CreditCard,
  Landmark,
} from "lucide-react";

import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Metodo = "contanti" | "pos" | "bonifico";

type Props = {
  ordineId: string;
  totale: number;
  metodoPagamento?: Metodo | null;
  pagatoAt?: string | null;
};

export function SegnaPagato({
  ordineId,
  totale,
  metodoPagamento,
  pagatoAt,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [saving, setSaving] = useState(false);
  const [metodo, setMetodo] = useState<Metodo | null>(
    metodoPagamento ?? null
  );
  const [confirmed, setConfirmed] = useState(
    Boolean(metodoPagamento)
  );

  async function segnaPagato(m: Metodo) {
    if (saving || confirmed) return;

    setSaving(true);
    setMetodo(m);

    const { error } = await supabase
      .from("ordini")
      .update({
        metodo_pagamento: m,
        pagato_at: new Date().toISOString(),
      })
      .eq("id", ordineId);

    if (error) {
      alert(error.message);
      setSaving(false);
      setMetodo(null);
      return;
    }

    setConfirmed(true);

    setTimeout(() => {
      router.refresh();
    }, 700);
  }

  const dataPagamento = pagatoAt
    ? new Intl.DateTimeFormat("it-IT").format(
        new Date(pagatoAt)
      )
    : new Intl.DateTimeFormat("it-IT").format(new Date());

  const nomeMetodo =
    metodo === "contanti"
      ? "CONTANTI"
      : metodo === "pos"
        ? "POS"
        : metodo === "bonifico"
          ? "BONIFICO"
          : "";

  return (
    <Card className="rounded-2xl border-2 p-4">
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          PAGAMENTO
        </p>

        <p className="mt-1 text-2xl font-bold">
          € {totale.toFixed(2)}
        </p>
      </div>

      {!confirmed ? (
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            disabled={saving}
            onClick={() => segnaPagato("contanti")}
            className="h-12 rounded-xl bg-[#1668E8] text-xs font-bold hover:bg-[#0F5BD6]"
          >
            <Banknote className="mr-1.5 h-4 w-4" />
            CONTANTI
          </Button>

          <Button
            type="button"
            disabled={saving}
            onClick={() => segnaPagato("pos")}
            className="h-12 rounded-xl bg-[#1668E8] text-xs font-bold hover:bg-[#0F5BD6]"
          >
            <CreditCard className="mr-1.5 h-4 w-4" />
            POS
          </Button>

          <Button
            type="button"
            disabled={saving}
            onClick={() => segnaPagato("bonifico")}
            className="h-12 rounded-xl bg-[#1668E8] text-xs font-bold hover:bg-[#0F5BD6]"
          >
            <Landmark className="mr-1.5 h-4 w-4" />
            BONIFICO
          </Button>
        </div>
      ) : (
        <div className="flex h-12 items-center justify-center rounded-xl bg-green-600 text-sm font-bold text-white">
          <Check className="mr-2 h-5 w-5" />
          PAGATO CON {nomeMetodo} · IL {dataPagamento}
        </div>
      )}
    </Card>
  );
}
