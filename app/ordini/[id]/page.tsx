import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  CircleDashed,
  CheckCircle2,

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
          costo
        )
      )
    `)
    .eq("id", id)
    .single();

  if (!data) notFound();

  const righe = data.ordine_righe ?? [];

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

      <Link href="/ordini">
        <Button
          variant="outline"
          className="justify-start rounded-2xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna agli Ordini
        </Button>
      </Link>

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
              const prezzo = Number(
                riga.articoli?.costo ?? 0
              );

              const quantita = Number(
                riga.quantita ?? 0
              );

              const consegnata = Number(
                riga.quantita_consegnata ?? 0
              );

              const residua = Math.max(
                0,
                quantita - consegnata
              );

              return (
                <div
                  key={riga.id}
                  className="rounded-2xl border-2 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="font-semibold">
                        {riga.articoli?.nome}
                      </p>

                      {riga.taglia && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Taglia {riga.taglia}
                        </p>
                      )}

                    </div>

                    <p className="shrink-0 font-bold">
                      €{(prezzo * quantita).toFixed(2)}
                    </p>

                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Ordinata
                      </p>
                      <p className="mt-1 font-bold">
                        {quantita}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Consegnata
                      </p>
                      <p className="mt-1 font-bold">
                        {consegnata}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Da consegnare
                      </p>
                      <p className="mt-1 font-bold">
                        {residua}
                      </p>
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

      {righe.some(
          (riga: any) =>
            Number(riga.quantita_consegnata ?? 0) <
            Number(riga.quantita ?? 0)
        ) && (
          <GestisciConsegna
            ordineId={id}
            righe={righe.map((riga: any) => ({
              id: riga.id,
              articoloId: riga.articolo_id,
              articolo: riga.articoli
                ? { nome: riga.articoli.nome }
                : null,
              taglia: riga.taglia,
              quantita: Number(riga.quantita ?? 0),
              quantita_consegnata: Number(
                riga.quantita_consegnata ?? 0
              ),
            }))}
          />
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
