import Link from "next/link";
import { Plus, Shirt } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function ArticoliPage() {
  const { data: articoli } = await supabase
    .from("articoli")
    .select("*")
    .order("categoria")
    .order("nome");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Link href="/articoli/nuovo">
        <Button className="h-14 w-full justify-start rounded-2xl bg-[#1668E8]">
          <Plus className="mr-3 h-5 w-5" />
          Nuovo Articolo
        </Button>
      </Link>

      {articoli?.map((articolo) => (
        <Link
          key={articolo.id}
          href={`/articoli/${articolo.id}`}
        >
          <Card className="rounded-2xl border-2 border-slate-200 p-4 shadow-sm transition hover:border-[#1668E8]">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1668E8]/10">
                <Shirt className="h-6 w-6 text-[#1668E8]" />
              </div>

              <div className="flex-1">

                <p className="text-xs text-slate-500">
                  {articolo.categoria}
                </p>

                <h2 className="font-semibold">
                  {articolo.nome}
                </h2>

                <p className="text-sm text-slate-500">
                  {articolo.codice_fornitore || "-"}
                </p>

              </div>

            </div>

          </Card>
        </Link>
      ))}

      {!articoli?.length && (
        <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-slate-500">
          Nessun articolo presente
        </Card>
      )}

    </div>
  );
}
