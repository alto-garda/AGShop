"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageCheck } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Riga = {
  id: string;
  articolo: {
    nome: string;
  } | null;
  taglia: string | null;
  quantita: number;
  quantita_consegnata: number;
};

export function GestisciConsegna({
  ordineId,
  righe,
}: {
  ordineId: string;
  righe: Riga[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [quantita, setQuantita] = useState<Record<string, string>>(
    Object.fromEntries(
      righe.map((riga) => [
        riga.id,
        String(
          Math.max(
            0,
            riga.quantita - riga.quantita_consegnata
          )
        ),
      ])
    )
  );

  const [saving, setSaving] = useState(false);

  async function consegna() {
    if (saving) return;

    const righeDaConsegnare = righe
      .map((riga) => ({
        riga,
        valore: Number(quantita[riga.id] ?? 0),
      }))
      .filter((item) => item.valore > 0);

    if (righeDaConsegnare.length === 0) {
      alert("Inserisci almeno una quantità da consegnare.");
      return;
    }

    for (const item of righeDaConsegnare) {
      const residua =
        item.riga.quantita -
        item.riga.quantita_consegnata;

      if (item.valore > residua) {
        alert(
          `${item.riga.articolo?.nome}: massimo ${residua} pezzi.`
        );
        return;
      }
    }

    setSaving(true);

    try {
      for (const item of righeDaConsegnare) {
        const { error } = await supabase.rpc(
          "consegna_riga_ordine",
          {
            p_riga_id: item.riga.id,
            p_quantita: item.valore,
          }
        );

        if (error) {
          throw new Error(error.message);
        }
      }

      const { data: aggiornate, error: righeError } =
        await supabase
          .from("ordine_righe")
          .select("quantita, quantita_consegnata")
          .eq("ordine_id", ordineId);

      if (righeError) {
        throw new Error(righeError.message);
      }

      const tutteConsegnate =
        aggiornate?.every(
          (riga) =>
            riga.quantita_consegnata >= riga.quantita
        ) ?? false;

      const nuovoStato = tutteConsegnate
        ? "consegnato"
        : "parziale";

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
    <Card className="rounded-3xl border-2 p-5">

      <h2 className="mb-4 text-lg font-bold">
        Gestisci consegna
      </h2>

      <div className="space-y-3">

        {righe.map((riga) => {
          const residua =
            riga.quantita -
            riga.quantita_consegnata;

          if (residua <= 0) return null;

          return (
            <div
              key={riga.id}
              className="rounded-2xl border-2 p-4"
            >

              <div className="mb-3">

                <p className="font-semibold">
                  {riga.articolo?.nome}
                </p>

                <p className="text-sm text-muted-foreground">
                  {riga.taglia
                    ? `Taglia ${riga.taglia} · `
                    : ""}
                  Da consegnare: {residua}
                </p>

              </div>

              <Input
                type="number"
                min="0"
                max={residua}
                value={quantita[riga.id] ?? "0"}
                onChange={(e) =>
                  setQuantita({
                    ...quantita,
                    [riga.id]: e.target.value,
                  })
                }
                placeholder="Quantità consegnata"
              />

            </div>
          );
        })}

      </div>

      <Button
        onClick={consegna}
        disabled={saving}
        className="mt-4 h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
      >
        <PackageCheck className="mr-3 h-5 w-5" />
        {saving
          ? "Registrazione..."
          : "Registra Consegna"}
      </Button>

    </Card>
  );
}
