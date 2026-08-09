import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  CircleDashed,
  CheckCircle2,
  Package,
  ClipboardList,

} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegnaPagato } from "@/components/ordini/SegnaPagato";
import { GestisciConsegna } from "@/components/ordini/GestisciConsegna";
import { CambiaStatoOrdine } from "@/components/ordini/CambiaStatoOrdine";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrdinePage({ params }: Props) {
  const { id } = await params;

  const { data } = await supabase
    .from("ordini")
    .select(`
      *,
      tesserati (
        nome,
        cognome
      ),
      ordine_righe (
        id,
        articolo_id,
        taglia,
        quantita,
        quantita_consegnata,
        articoli (
          nome,
          categoria
        )
      )
    `)
    .eq("id", id)
    .single();

  if (!data) notFound();

  const righe = data.ordine_righe ?? [];

    const articoloIds = [
      ...new Set(
        righe.map((riga: any) => riga.articolo_id)
      ),
    ];

    const { data: disponibilita } =
      articoloIds.length
        ? await supabase
            .from("articolo_taglie")
            .select("articolo_id, taglia, giacenza")
            .in("articolo_id", articoloIds)
        : { data: [] };

    const disponibilitaMap = new Map(
      (disponibilita ?? []).map((item: any) => [
        `${item.articolo_id}:${item.taglia}`,
        Number(item.giacenza ?? 0),
      ])
    );

  const { data: ordineKit, error: ordineKitError } =
    await supabase
      .from("ordine_kit")
      .select(`
        id,
        quantita,
        prezzo_unitario,
        kit_id
      `)
      .eq("ordine_id", id);

  if (ordineKitError) {
    throw new Error(ordineKitError.message);
  }

  const kitIds = (ordineKit ?? []).map(
    (item: any) => item.kit_id
  );

  const { data: kitData, error: kitError } =
    kitIds.length
      ? await supabase
          .from("kit")
          .select("id, nome")
          .in("id", kitIds)
      : { data: [], error: null };

  if (kitError) {
    throw new Error(kitError.message);
  }

  const kitMap = new Map(
    (kitData ?? []).map((item: any) => [
      item.id,
      item.nome,
    ])
  );

  const kitArticoloIds = new Set<string>();

  for (const item of ordineKit ?? []) {
    const { data: componenti } = await supabase
      .from("kit_righe")
      .select("articolo_id")
      .eq("kit_id", item.kit_id);

    for (const componente of componenti ?? []) {
      kitArticoloIds.add(componente.articolo_id);
    }
  }

  const totaleArticoli = righe.reduce(
    (sum: number, riga: any) => {
      if (kitArticoloIds.has(riga.articolo_id)) {
        return sum;
      }

      return (
        sum +
        Number(riga.articoli?.costo ?? 0) *
          Number(riga.quantita ?? 0)
      );
    },
    0
  );

  const totaleKit = (ordineKit ?? []).reduce(
    (sum: number, item: any) =>
      sum +
      Number(item.prezzo_unitario ?? 0) *
        Number(item.quantita ?? 0),
    0
  );

  const totale = totaleArticoli + totaleKit;

  return (
    <div className="flex flex-col gap-4">
<Card className="rounded-3xl border-2 p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1668E8]/10">
            <ShoppingCart className="h-8 w-8 text-[#1668E8]" />
          </div>

          <div className="min-w-0">

            <h1 className="text-xl font-bold">
              {data.tesserati?.cognome}{" "}
              {data.tesserati?.nome}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CircleDashed className="h-4 w-4" />
              {data.stato}
            </div>

          </div>

        </div>

      </Card>

      <Card className="rounded-3xl border-2 p-5">

        <h2 className="mb-4 font-semibold">
          Articoli
        </h2>

        {righe.length ? (
          <div className="space-y-3">

            {righe.map((riga: any) => {
          const quantita = Number(riga.quantita ?? 0);
          const consegnata = Number(
            riga.quantita_consegnata ?? 0
          );

          const residua = Math.max(
            0,
            quantita - consegnata
          );

          const disponibilitaRiga =
            disponibilitaMap.get(
              `${riga.articolo_id}:${riga.taglia ?? "Unica"}`
            ) ?? 0;

          return (
            <div
              key={riga.id}
              className="rounded-2xl border-2 p-3"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#1668E8]">
                {riga.articoli?.categoria}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <p className="col-span-2 flex min-h-[40px] items-center text-base font-bold leading-tight">
                  {riga.articoli?.nome}
                </p>

                <div className="flex min-h-[40px] items-center justify-center rounded-xl bg-black px-2 text-base font-bold text-white">
                  {riga.taglia ?? "—"}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex min-h-[56px] flex-col justify-center rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
              <p className="text-[9px] font-bold leading-none text-muted-foreground">
                DISPONIBILI
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <p className="text-xl font-bold leading-none">
                  {disponibilitaRiga}
                </p>
              </div>
            </div>

                <div className="flex min-h-[56px] flex-col justify-center rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
              <p className="text-[9px] font-bold leading-none text-muted-foreground">
                DA CONSEGNARE
              </p>

              <div className="mt-1 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                <p className="text-xl font-bold leading-none">
                  {residua}
                </p>
              </div>
            </div>

                <div className="min-h-[64px]">
                  <GestisciConsegna
                    ordineId={id}
                    riga={{
                      id: riga.id,
                      articolo: riga.articoli
                        ? { nome: riga.articoli.nome }
                        : null,
                      taglia: riga.taglia,
                      quantita,
                      quantita_consegnata: consegnata,
                      disponibilita: disponibilitaRiga,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

          </div>
        ) : (
          <p className="text-slate-500">
            Nessun articolo inserito.
          </p>
        )}

        {righe.length > 0 && (
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <span className="font-semibold">
              Totale ordine
            </span>

            <span className="text-2xl font-bold">
              € {totale.toFixed(2)}
            </span>
          </div>
        )}

      </Card>

      {data.note && (
        <Card className="rounded-3xl border-2 p-5">
          <h2 className="mb-2 font-semibold">
            Note
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            {data.note}
          </p>
        </Card>
      )}
{data.stato === "consegnato" &&
        !data.metodo_pagamento && (
          <SegnaPagato ordineId={id} />
        )}

      {data.metodo_pagamento && (
        <Card className="rounded-3xl border-2 border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />

            <div>
              <p className="font-semibold">
                Pagato
              </p>

              <p className="text-sm text-green-700 dark:text-green-400">
                Metodo:{" "}
                {data.metodo_pagamento === "pos"
                  ? "POS"
                  : data.metodo_pagamento === "contanti"
                    ? "Contanti"
                    : "Bonifico"}
              </p>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
