import Link from "next/link";
import {
  Plus,
  ShoppingCart,
  UserRound,
  CircleDashed,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function OrdiniPage() {
  const { data: ordini } = await supabase
    .from("ordini")
    .select(`
      *,
      tesserati (
        nome,
        cognome
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Link href="/ordini/nuovo">
        <Button className="h-14 w-full justify-start rounded-2xl bg-[#1668E8]">
          <Plus className="mr-3 h-5 w-5" />
          Nuovo Ordine
        </Button>
      </Link>

      {ordini?.map((ordine) => (
        <Link
          key={ordine.id}
          href={`/ordini/${ordine.id}`}
        >
          <Card className="rounded-2xl border-2 border-slate-200 p-4 shadow-sm transition hover:border-[#1668E8]">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1668E8]/10">
                <ShoppingCart className="h-6 w-6 text-[#1668E8]" />
              </div>

              <div className="flex-1">

                <h2 className="font-semibold">
                  {ordine.tesserati?.cognome} {ordine.tesserati?.nome}
                </h2>

                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <CircleDashed className="h-4 w-4" />
                  {ordine.stato}
                </div>

              </div>

            </div>

          </Card>
        </Link>
      ))}

      {!ordini?.length && (
        <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-slate-500">
          Nessun ordine presente
        </Card>
      )}

    </div>
  );
}
