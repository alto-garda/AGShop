"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, PackageCheck } from "lucide-react";

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

  const residua = Math.max(
    0,
    riga.quantita - riga.quantita_consegnata
  );

  const [saving, setSaving] = useState(false);
  const [justDelivered, setJustDelivered] = useState(false);

  const completata = residua <= 0;

  async function consegnaUno() {
    if (saving || completata) return;

    if (riga.disponibilita <= 0) {
      alert("Nessuna disponibilità in magazzino.");
      return;
    }

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

      setJustDelivered(true);

      setTimeout(() => {
        setJustDelivered(false);
      }, 500);

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

  const colore =
    riga.disponibilita <= 0
      ? "bg-red-500 hover:bg-red-500 cursor-not-allowed"
      : riga.disponibilita < residua
        ? "bg-amber-400 hover:bg-amber-500"
        : "bg-green-500 hover:bg-green-600";

  return (
    <Button
      type="button"
      onClick={consegnaUno}
      disabled={saving || completata || riga.disponibilita <= 0}
      className={`flex h-full min-h-[56px] w-full rounded-xl px-2 text-white transition-all duration-300 ${colore}`}
    >
      {completata || justDelivered ? (
        <Check className="h-6 w-6 transition-all duration-300" />
      ) : (
        <div className="flex items-center gap-1.5">
          <PackageCheck className="h-4 w-4" />
          <span className="text-xs font-bold">
            CONSEGNA
          </span>
        </div>
      )}
    </Button>
  );
}