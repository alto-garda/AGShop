import Link from "next/link";
import {
  Plus,
  ShoppingCart,
  CircleDashed,
  Archive,
} from "lucide-react";

import { createClient } from "@/lib/supabase-server";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Ordine = {
  id: string;
  stato: string;
  metodo_pagamento: string | null;
  created_at: string;
  tesserati: {
    nome: string;
    cognome: string;
  } | null;
};

export default async function OrdiniPage({
  searchParams,
}: {
  searchParams: Promise<{ stato?: string }>;
}) {
  const supabase = await createClient();
  const { stato } = await searchParams;

  let query = supabase
    .from("ordini")
    .select(`
      *,
      tesserati (
        nome,
        cognome
      )
    `);

  if (
    stato === "in_attesa" ||
    stato === "parziale" ||
    stato === "pronto"
  ) {
    query = query.eq("stato", stato);
  }

  const { data: ordini } = await query
    .order("created_at", {
      ascending: true,
    });

  const ordiniTipizzati = (ordini ?? []) as Ordine[];

  const ordiniAttivi = ordiniTipizzati.filter(
    (ordine) =>
      !(
        ordine.stato === "pronto" &&
        ordine.metodo_pagamento
      )
  );

  return (
    <div className="flex flex-col gap-5">

      <Link href="/ordini/nuovo">
        <Button className="h-12 w-full justify-center rounded-2xl bg-[#1668E8] font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Nuovo Ordine
        </Button>
      </Link>

      {ordiniAttivi.map((ordine) => {
        const coloreCarrello =
          ordine.stato === "pronto"
            ? "bg-green-500/10 text-green-600"
            : ordine.stato === "parziale"
              ? "bg-amber-400/15 text-amber-500"
              : "bg-red-500/10 text-red-500";

        const statoLabel =
          ordine.stato === "in_attesa"
            ? "in attesa"
            : ordine.stato;

        return (
          <Link
            key={ordine.id}
            href={`/ordini/${ordine.id}`}
          >
            <Card className="rounded-2xl border p-3 shadow-sm transition hover:border-[#1668E8]">
              <div className="flex items-center gap-3">

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${coloreCarrello}`}
                >
                  <ShoppingCart className="h-[22px] w-[22px]" />
                </div>

                <div className="flex-1">

                  <h2 className="font-semibold">
                    {ordine.tesserati?.cognome}{" "}
                    {ordine.tesserati?.nome}
                  </h2>

                  <div className="mt-1 flex items-center justify-between gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CircleDashed className="h-[18px] w-[18px]" />
                  {statoLabel}
                </div>

                <span className="text-xs text-slate-400">
                  {new Date(ordine.created_at).toLocaleDateString("it-IT")}
                </span>
              </div>


                </div>

              </div>
            </Card>
          </Link>
        );
      })}

      {!ordiniAttivi.length && (
        <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-slate-500">
          Nessun ordine presente
        </Card>
      )}

      <Link href="/ordini/archivio">
        <Button className="h-12 w-full rounded-2xl bg-[#1668E8] font-semibold">
          <Archive className="mr-2 h-5 w-5" />
          Archivio
        </Button>
      </Link>

    </div>
  );
}
