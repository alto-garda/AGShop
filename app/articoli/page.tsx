import Link from "next/link";
import { Plus, Shirt } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function ArticoliPage() {
  const { data: articoli } = await supabase
    .from("articoli")
    .select(`
      *,
      articolo_taglie (
        taglia,
        giacenza
      )
    `)
    .order("categoria")
    .order("nome");

  return (
    <div className="flex flex-col gap-3">

      <Link href="/articoli/nuovo">
        <Button className="h-14 w-full justify-start rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]">
          <Plus className="mr-3 h-5 w-5" />
          Nuovo Articolo
        </Button>
      </Link>

      {articoli?.map((articolo) => {
        const taglie = articolo.articolo_taglie ?? [];

        const totaleGiacenza = taglie.reduce(
          (totale: number, item: { giacenza: number | null }) =>
            totale + (item.giacenza ?? 0),
          0
        );

        return (
          <Link
            key={articolo.id}
            href={`/articoli/${articolo.id}`}
          >
            <Card className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#1668E8] dark:border-slate-700 dark:bg-slate-900">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1668E8]/10">
                  <Shirt className="h-6 w-6 text-[#1668E8]" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {articolo.categoria}
                  </p>

                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {articolo.nome}
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {articolo.codice_fornitore || "-"}
                  </p>

                </div>

                <div className="shrink-0 text-right">

                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    € {Number(articolo.costo ?? 0).toFixed(2)}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {totaleGiacenza} pezzi
                  </p>

                </div>

              </div>

              {taglie.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {taglie.map(
                    (item: {
                      taglia: string;
                      giacenza: number | null;
                    }) => (
                      <span
                        key={item.taglia}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {item.taglia}: {item.giacenza ?? 0}
                      </span>
                    )
                  )}
                </div>
              )}

            </Card>
          </Link>
        );
      })}

      {!articoli?.length && (
        <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-slate-500">
          Nessun articolo presente
        </Card>
      )}

    </div>
  );
}
