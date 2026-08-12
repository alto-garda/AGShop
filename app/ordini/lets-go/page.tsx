import Link from "next/link";
import { ArrowLeft, ShoppingCart, PackageOpen } from "lucide-react";

import { createClient } from "@/lib/supabase-server";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RigaOrdine = {
  articolo_id: string;
  taglia: string | null;
  quantita: number;
  quantita_consegnata: number;
  ordini: {
    id: string;
    stato: string;
    metodo_pagamento: string | null;
  } | null;
  articoli: {
    nome: string;
    categoria: string | null;
  } | null;
};

type Mancante = {
  articolo_id: string;
  nome: string;
  categoria: string | null;
  taglia: string | null;
  quantita: number;
};

export default async function LetsGoPage() {
  const supabase = await createClient();
  const { data: righe } = await supabase
    .from("ordine_righe")
    .select(`
      articolo_id,
      taglia,
      quantita,
      quantita_consegnata,
      ordini!inner (
        id,
        stato,
        metodo_pagamento
      ),
      articoli (
        nome,
        categoria
      )
    `);

  const righeAttive = (righe ?? []) as unknown as RigaOrdine[];

  const richiesto = new Map<string, Mancante>();

  for (const riga of righeAttive) {
    const ordine = riga.ordini;

    if (!ordine) continue;

    const archiviato =
      ordine.stato === "pronto" &&
      !!ordine.metodo_pagamento;

    if (archiviato) continue;

    const residuo = Math.max(
      0,
      Number(riga.quantita ?? 0) -
        Number(riga.quantita_consegnata ?? 0)
    );

    if (residuo <= 0 || !riga.articoli) continue;

    const key = `${riga.articolo_id}__${riga.taglia ?? ""}`;

    const esistente = richiesto.get(key);

    if (esistente) {
      esistente.quantita += residuo;
    } else {
      richiesto.set(key, {
        articolo_id: riga.articolo_id,
        nome: riga.articoli.nome,
        categoria: riga.articoli.categoria,
        taglia: riga.taglia,
        quantita: residuo,
      });
    }
  }

  const articoloIds = [
    ...new Set(
      [...richiesto.values()].map(
        (item) => item.articolo_id
      )
    ),
  ];

  const { data: giacenze } = articoloIds.length
    ? await supabase
        .from("articolo_taglie")
        .select("articolo_id, taglia, giacenza")
        .in("articolo_id", articoloIds)
    : { data: [] };

  const stockMap = new Map<string, number>();

  for (const stock of giacenze ?? []) {
    stockMap.set(
      `${stock.articolo_id}__${stock.taglia ?? ""}`,
      Number(stock.giacenza ?? 0)
    );
  }

  const mancanti = [...richiesto.values()]
    .map((item) => {
      const key = `${item.articolo_id}__${item.taglia ?? ""}`;
      const disponibilita = stockMap.get(key) ?? 0;

      return {
        ...item,
        quantita: Math.max(
          0,
          item.quantita - disponibilita
        ),
      };
    })
    .filter((item) => item.quantita > 0)
    .sort((a, b) => {
      const categorie: Record<string, number> = {
        rapp: 1,
        allenamento: 2,
        merch: 3,
      };

      const categoriaA =
        categorie[a.categoria?.toLowerCase() ?? ""] ?? 99;

      const categoriaB =
        categorie[b.categoria?.toLowerCase() ?? ""] ?? 99;

      if (categoriaA !== categoriaB) {
        return categoriaA - categoriaB;
      }

      const nome = a.nome.localeCompare(
        b.nome,
        "it"
      );

      if (nome !== 0) return nome;

      return (a.taglia ?? "").localeCompare(
        b.taglia ?? "",
        "it"
      );
    });

  return (
    <div className="flex flex-col gap-5">

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
          <ShoppingCart className="h-[22px] w-[22px] text-red-500" />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Ordine Let's Go
          </h1>

          <p className="text-xs text-muted-foreground">
            Materiale da ordinare per completare gli ordini attivi
          </p>
        </div>
      </div>

      {mancanti.length > 0 ? (
        <div className="flex flex-col gap-3">
          {mancanti.map((item) => (
            <Card
              key={`${item.articolo_id}-${item.taglia ?? ""}`}
              className="rounded-2xl border p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                  <PackageOpen className="h-[22px] w-[22px] text-red-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {item.nome}
                  </p>

                  {item.taglia && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Taglia {item.taglia}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-red-500">
                    {item.quantita}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    da ordinare
                  </p>
                </div>

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-muted-foreground">
          Nessun materiale da ordinare
        </Card>
      )}

    </div>
  );
}
