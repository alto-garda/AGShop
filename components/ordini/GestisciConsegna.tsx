"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ClipboardList, PackageCheck } from "lucide-react";

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

  return (
    <Button
      type="button"
      onClick={consegnaUno}
      disabled={
        saving ||
        completata ||
        riga.disponibilita < residua
      }
      className={`flex h-full min-h-[56px] w-full rounded-xl px-2 text-white ${
        riga.disponibilita < residua
          ? "bg-red-600 hover:bg-red-600 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {completata || justDelivered ? (
        <Check className="h-5 w-5" />
      ) : (
        <>
          <PackageCheck className="mr-1.5 h-4 w-4" />
          <span className="text-[10px] font-bold">
            CONSEGNA
          </span>
        </>
      )}
    </Button>
  );
}
