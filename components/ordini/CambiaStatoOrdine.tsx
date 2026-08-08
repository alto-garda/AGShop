"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stati = [
  {
    value: "inserito",
    label: "Inserito",
  },
  {
    value: "prenotato",
    label: "Prenotato",
  },
  {
    value: "arrivato",
    label: "Arrivato",
  },
] as const;

type StatoBase = (typeof stati)[number]["value"];

export function CambiaStatoOrdine({
  ordineId,
  stato,
}: {
  ordineId: string;
  stato: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [saving, setSaving] = useState(false);

  const indice = stati.findIndex(
    (item) => item.value === stato
  );

  const prossimo =
    indice >= 0 && indice < stati.length - 1
      ? stati[indice + 1]
      : null;

  async function cambiaStato(nuovoStato: StatoBase) {
    if (saving) return;

    setSaving(true);

    const { error } = await supabase
      .from("ordini")
      .update({
        stato: nuovoStato,
      })
      .eq("id", ordineId);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    router.refresh();
    setSaving(false);
  }

  if (!prossimo) return null;

  return (
    <Card className="rounded-3xl border-2 p-5">

      <p className="text-sm text-muted-foreground">
        Stato ordine
      </p>

      <p className="mt-1 text-lg font-bold">
        {stati[indice]?.label ?? stato}
      </p>

      <div className="mt-4 space-y-2">
        {stati.map((item, i) => {
          const attivo = i <= indice;

          return (
            <div
              key={item.value}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
                attivo
                  ? "border-[#1668E8] bg-[#1668E8]/5"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  attivo
                    ? "bg-[#1668E8] text-white"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                {attivo ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs">
                    {i + 1}
                  </span>
                )}
              </div>

              <span
                className={
                  attivo
                    ? "font-semibold"
                    : "text-slate-500"
                }
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {prossimo && (
        <Button
          onClick={() => cambiaStato(prossimo.value)}
          disabled={saving}
          className="mt-4 h-12 w-full rounded-2xl bg-[#1668E8]"
        >
          {saving
            ? "Salvataggio..."
            : `Segna come ${prossimo.label}`}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      )}

    </Card>
  );
}
