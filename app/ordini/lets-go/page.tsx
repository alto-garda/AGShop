import {
  ShoppingCart,
  PackageOpen,
} from "lucide-react";

import { createClient } from "@/lib/supabase-server";
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

type Materiale = {
  articolo_id: string;
  nome: string;
  categoria: string | null;
  taglia: string | null;
  disponibilita: number;
  richiesto: number;
  mancante: number;
};

export default async function LetsGoPage() {
  const supabase = await createClient();

  const [{ data: righe }, { data: giacenze }] =
    await Promise.all([
      supabase
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
        `),

      supabase
        .from("articolo_taglie")
        .select(`
          articolo_id,
          taglia,
          giacenza,
          articoli (
            nome,
            categoria
          )
        `),
    ]);

  const righeAttive =
    (righe ?? []) as unknown as RigaOrdine[];

  /*
   * Quantità ancora necessaria per tutti gli
   * ordini attivi.
   */
  const richiestoMap = new Map<string, number>();

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

    if (residuo <= 0) continue;

    const key = `${riga.articolo_id}__${riga.taglia ?? "Unica"}`;

    richiestoMap.set(
      key,
      (richiestoMap.get(key) ?? 0) + residuo
    );
  }

  /*
   * Partiamo da TUTTE le giacenze presenti in
   * articolo_taglie.
   */
  const materiali: Materiale[] = (giacenze ?? [])
    .map((stock: any) => {
      const disponibilita = Number(
        stock.giacenza ?? 0
      );

      const taglia = stock.taglia ?? null;

      const key = `${stock.articolo_id}__${taglia ?? "Unica"}`;

      const richiesto =
        richiestoMap.get(key) ?? 0;

      return {
        articolo_id: stock.articolo_id,
        nome:
          stock.articoli?.nome ??
          "Articolo",
        categoria:
          stock.articoli?.categoria ?? null,
        taglia,
        disponibilita,
        richiesto,
        mancante: Math.max(
          0,
          richiesto - disponibilita
        ),
      };
    });

  /*
   * 🟡 DA ORDINARE
   *
   * C'è richiesta negli ordini e la giacenza
   * non è sufficiente.
   *
   * Se la giacenza è 0 ma il materiale è richiesto,
   * rimane QUI.
   */
  const daOrdinare = materiali
    .filter(
      (item) =>
        item.richiesto > item.disponibilita
    )
    .sort((a, b) => {
      const categorie: Record<string, number> = {
        rapp: 1,
        rappresentanza: 1,
        allenamento: 2,
        merch: 3,
      };

      const categoriaA =
        categorie[
          a.categoria?.toLowerCase() ?? ""
        ] ?? 99;

      const categoriaB =
        categorie[
          b.categoria?.toLowerCase() ?? ""
        ] ?? 99;

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

  /*
   * 🔴 GIACENZA 0 — NON RICHIESTO
   *
   * Materiale completamente esaurito ma che
   * NON serve ad alcun ordine attivo.
   */
  const giacenzaZero = materiali
    .filter(
      (item) =>
        item.disponibilita <= 0 &&
        item.richiesto <= 0
    )
    .sort((a, b) => {
      const categorie: Record<string, number> = {
        rapp: 1,
        rappresentanza: 1,
        allenamento: 2,
        merch: 3,
      };

      const categoriaA =
        categorie[
          a.categoria?.toLowerCase() ?? ""
        ] ?? 99;

      const categoriaB =
        categorie[
          b.categoria?.toLowerCase() ?? ""
        ] ?? 99;

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
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-500/10">
          <ShoppingCart className="h-[22px] w-[22px] text-yellow-600" />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Ordine Let's Go
          </h1>

          <p className="text-xs text-muted-foreground">
            Verifica il materiale necessario per
            completare gli ordini attivi
          </p>
        </div>
      </div>

      {/* 🟡 DA ORDINARE */}
      {daOrdinare.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />

            <h2 className="text-sm font-bold uppercase tracking-wide text-yellow-700 dark:text-yellow-400">
              Da ordinare
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {daOrdinare.map((item) => (
              <Card
                key={`ordine-${item.articolo_id}-${item.taglia ?? "Unica"}`}
                className="rounded-2xl border-2 border-yellow-200 bg-yellow-50/50 p-4 shadow-sm dark:border-yellow-900/50 dark:bg-yellow-950/10"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-500/10">
                    <PackageOpen className="h-[22px] w-[22px] text-yellow-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {item.nome}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.taglia
                        ? `Taglia ${item.taglia}`
                        : "Taglia Unica"}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Disponibili{" "}
                      <span className="font-semibold text-foreground">
                        {item.disponibilita}
                      </span>
                      {" · "}
                      Richiesti{" "}
                      <span className="font-semibold text-foreground">
                        {item.richiesto}
                      </span>
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-bold text-yellow-600">
                      {item.mancante}
                    </p>

                    <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                      da ordinare
                    </p>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 🔴 GIACENZA A ZERO */}
      {giacenzaZero.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />

            <h2 className="text-sm font-bold uppercase tracking-wide text-red-600">
              Giacenza a Zero
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {giacenzaZero.map((item) => (
              <Card
                key={`zero-${item.articolo_id}-${item.taglia ?? "Unica"}`}
                className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-4 shadow-sm dark:border-red-900/50 dark:bg-red-950/10"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                    <PackageOpen className="h-[22px] w-[22px] text-red-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {item.nome}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.taglia
                        ? `Taglia ${item.taglia}`
                        : "Taglia Unica"}
                    </p>

                    <p className="mt-2 text-xs text-red-600">
                      Giacenza attuale: 0
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-red-600">
                      Non richiesta
                    </p>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {daOrdinare.length === 0 &&
        giacenzaZero.length === 0 && (
          <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-muted-foreground">
            Nessun materiale da segnalare
          </Card>
        )}

    </div>
  );
}
