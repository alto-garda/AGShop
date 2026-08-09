"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";

type Riga = {
  id: string;
  articolo: {
    nome: string;
  } | null;
  taglia: string | null;
  quantita: number;
  quantita_consegnata: number;
  disponibilita: number;
};

export function GestisciConsegna({
  ordineId,
  riga,
}: {
  ordineId: string;
  riga: Riga;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  const residua = Math.max(
    0,
    riga.quantita - riga.quantita_consegnata
  );

  const disponibile = riga.disponibilita > 0;
  const completata = residua <= 0;
  const consegnabile = disponibile && !completata;

  async function consegnaUno() {
    if (saving || !consegnabile) return;

    setSaving(true);

    try {
      const { error } = await supabase.rpc(
        "consegna_riga_ordine",
        {
          p_riga_id: riga.id,
          p_quantita: 1,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      const { data: nuovoStato, error: statoError } =
        await supabase.rpc(
          "ricalcola_stato_ordine",
          {
            p_ordine_id: ordineId,
          }
        );

      if (statoError || !nuovoStato) {
        throw new Error(
          statoError?.message ??
            "Errore nel calcolo dello stato dell'ordine."
        );
      }

      const { error: ordineError } = await supabase
        .from("ordini")
        .update({
          stato: nuovoStato,
        })
        .eq("id", ordineId);

      if (ordineError) {
        throw new Error(ordineError.message);
      }

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Errore durante la consegna."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={consegnaUno}
      disabled={saving || !consegnabile}
      className={`h-full min-h-[76px] w-full rounded-xl px-2 text-sm font-bold ${
        completata
          ? "bg-green-600 text-white hover:bg-green-600"
          : consegnabile
            ? "bg-[#1668E8] text-white hover:bg-[#0F5BD6]"
            : "bg-muted text-muted-foreground opacity-50"
      }`}
    >
      {completata ? (
        <Check className="h-7 w-7" />
      ) : saving ? (
        "..."
      ) : (
        "CONSEGNA"
      )}
    </Button>
  );
}
