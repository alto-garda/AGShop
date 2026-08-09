"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, PackageCheck } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Riga = {
  id: string;
  articoloId: string;
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

  const [disponibilita, setDisponibilita] = useState<
    Record<string, number>
  >({});
  const [consegnate, setConsegnate] = useState<
    Record<string, boolean>
  >({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function caricaGiacenze() {
      const articoloIds = [
        ...new Set(righe.map((riga) => riga.articoloId)),
      ];

      if (!articoloIds.length) return;

      const { data, error } = await supabase
        .from("articolo_taglie")
        .select("articolo_id, taglia, giacenza")
        .in("articolo_id", articoloIds);

      if (error) {
        alert(error.message);
        return;
      }

      const map: Record<string, number> = {};

      for (const item of data ?? []) {
        const key = `${item.articolo_id}:${item.taglia ?? "Unica"}`;
        map[key] = Number(item.giacenza ?? 0);
      }

      setDisponibilita(map);
    }

    caricaGiacenze();
  }, [righe, supabase]);

  async function consegna(riga: Riga) {
    if (saving) return;

    const residua =
      riga.quantita - riga.quantita_consegnata;

    const key = `${riga.articoloId}:${riga.taglia ?? "Unica"}`;
    const disponibile = disponibilita[key] ?? 0;

    if (residua <= 0) return;

    if (disponibile < residua) {
      alert(
        `Giacenza insufficiente. Disponibili: ${disponibile}. Da consegnare: ${residua}.`
      );
      return;
    }

    setSaving(riga.id);

    try {
      const { error } = await supabase.rpc(
        "consegna_riga_ordine",
        {
          p_riga_id: riga.id,
          p_quantita: residua,
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

      setConsegnate((current) => ({
        ...current,
        [riga.id]: true,
      }));

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Errore durante la consegna."
      );
    } finally {
      setSaving(null);
    }
  }

  const righeDaConsegnare = righe.filter(
    (riga) =>
      riga.quantita - riga.quantita_consegnata > 0
  );

  if (!righeDaConsegnare.length) {
    return null;
  }

  return (
    <Card className="rounded-3xl border-2 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1668E8]/10">
          <PackageCheck className="h-5 w-5 text-[#1668E8]" />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Consegna
          </h2>

          <p className="text-sm text-muted-foreground">
            Verifica disponibilità e consegna gli articoli.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {righeDaConsegnare.map((riga) => {
          const residua =
            riga.quantita -
            riga.quantita_consegnata;

          const key = `${riga.articoloId}:${riga.taglia ?? "Unica"}`;
          const disponibile =
            disponibilita[key] ?? 0;

          const pronta = disponibile >= residua;
          const completata = consegnate[riga.id];

          return (
            <div
              key={riga.id}
              className="rounded-2xl border-2 p-4"
            >
              <div className="mb-3 min-w-0">
                <p className="font-semibold">
                  {riga.articolo?.nome}
                </p>

                {riga.taglia && (
                  <p className="text-sm text-muted-foreground">
                    Taglia {riga.taglia}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[11px] text-muted-foreground">
                    Disponibili
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {disponibile}
                  </p>
                </div>

                <div className="rounded-xl bg-muted p-3">
                  <p className="text-[11px] text-muted-foreground">
                    Da consegnare
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {residua}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => consegna(riga)}
                disabled={
                  !pronta ||
                  !!saving ||
                  completata
                }
                className={`mt-3 h-14 w-full rounded-2xl text-base font-bold ${
                  pronta
                    ? "bg-[#1668E8] hover:bg-[#0F5BD6]"
                    : "cursor-not-allowed opacity-35"
                }`}
              >
                {saving === riga.id
                  ? "Consegna..."
                  : completata
                    ? "CONSEGNA ✓"
                    : pronta
                      ? "CONSEGNA"
                      : "NON DISPONIBILE"}
                
                {completata && (
                  <Check className="ml-2 h-5 w-5" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
