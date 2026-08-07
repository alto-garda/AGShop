import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  UserRound,
  CircleDashed,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrdinePage({
  params,
}: Props) {
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
        taglia,
        quantita,
        articoli (
          nome
        )
      )
    `)
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">

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

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1668E8]/10">
            <ShoppingCart className="h-8 w-8 text-[#1668E8]" />
          </div>

          <div>

            <h1 className="text-xl font-bold">
              {data.tesserati?.cognome} {data.tesserati?.nome}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-slate-500">
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

        {data.ordine_righe?.length ? (
          <div className="space-y-3">

            {data.ordine_righe.map((riga: any) => (

              <div
                key={riga.id}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div>

                  <p className="font-medium">
                    {riga.articoli?.nome}
                  </p>

                  <p className="text-sm text-slate-500">
                    Taglia {riga.taglia}
                  </p>

                </div>

                <span className="font-bold">
                  x{riga.quantita}
                </span>

              </div>

            ))}

          </div>
        ) : (
          <p className="text-slate-500">
            Nessun articolo inserito.
          </p>
        )}

      </Card>

    </div>
  );
}
