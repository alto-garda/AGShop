import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Shirt,
  Package,
} from "lucide-react";

import { createClient } from "@/lib/supabase-server";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArticoloPage({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: articolo } = await supabase
    .from("articoli")
    .select("*")
    .eq("id", id)
    .single();

  if (!articolo) notFound();

  const { data: taglie } = await supabase
    .from("articolo_taglie")
    .select("*")
    .eq("articolo_id", id);

const ordineTaglie = [
  "4XS",
  "3XS",
  "2XS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "Unica",
];

taglie?.sort((a, b) => {
  const indiceA = ordineTaglie.indexOf(a.taglia);
  const indiceB = ordineTaglie.indexOf(b.taglia);

  if (indiceA === -1 && indiceB === -1) {
    return a.taglia.localeCompare(b.taglia);
  }

  if (indiceA === -1) return 1;
  if (indiceB === -1) return -1;

  return indiceA - indiceB;
});

  const totaleGiacenza = (taglie ?? []).reduce(
    (totale, item) => totale + (item.giacenza ?? 0),
    0
  );

  return (
    <div className="flex flex-col gap-4">

      <Link href="/articoli">
        <Button
          variant="outline"
          className="rounded-2xl border-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna agli Articoli
        </Button>
      </Link>

      <Card className="rounded-3xl border-2 p-6">

        <div className="flex flex-col items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1668E8]/10">
            <Shirt className="h-12 w-12 text-[#1668E8]" />
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
            {articolo.categoria || "Senza categoria"}
          </p>

          <h1 className="mt-1 text-center text-2xl font-bold">
            {articolo.nome}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {articolo.codice_fornitore || "-"}
          </p>

        </div>

      </Card>

      <div className="grid grid-cols-2 gap-3">

        <Card className="rounded-2xl border-2 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Costo
          </p>

          <p className="mt-1 text-xl font-bold">
            € {Number(articolo.costo ?? 0).toFixed(2)}
          </p>
        </Card>

        <Card className="rounded-2xl border-2 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Giacenza
          </p>

          <p className="mt-1 flex items-center gap-2 text-xl font-bold">
            <Package className="h-5 w-5 text-[#1668E8]" />
            {totaleGiacenza}
          </p>
        </Card>

      </div>

      <Card className="rounded-3xl border-2 p-5">

        <h2 className="mb-4 text-lg font-bold">
          Giacenza per taglia
        </h2>

        {taglie && taglie.length > 0 ? (
          <div className="space-y-2">
            {taglie.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border-2 p-4"
              >
                <span className="font-bold">
                  {item.taglia}
                </span>

                <span className="font-semibold">
                  {item.giacenza ?? 0} pezzi
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed p-5 text-center text-sm text-slate-500">
            Nessuna taglia configurata
          </p>
        )}

      </Card>

      <Link href={`/articoli/${id}/modifica`}>
        <Button className="h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]">
          <Pencil className="mr-3 h-5 w-5" />
          Modifica Articolo
        </Button>
      </Link>

    </div>
  );
}
