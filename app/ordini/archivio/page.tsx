import Link from "next/link";
import {
  ArrowLeft,
  Archive,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArchivioOrdiniPage() {
  const { data: ordini } = await supabase
    .from("ordini")
    .select(`
      *,
      tesserati (
        nome,
        cognome
      )
    `)
    .eq("stato", "pronto")
    .not("metodo_pagamento", "is", null)
    .order("created_at", {
      ascending: false,
    });

  return (
    <div className="flex flex-col gap-5">

      <Link href="/ordini">
        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl font-semibold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Torna agli ordini
        </Button>
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1668E8]/10">
          <Archive className="h-[22px] w-[22px] text-[#1668E8]" />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Archivio
          </h1>

          <p className="text-xs text-muted-foreground">
            Ordini completati e pagati
          </p>
        </div>
      </div>

      {ordini?.map((ordine) => {
        const metodo =
          ordine.metodo_pagamento === "pos"
            ? "POS"
            : ordine.metodo_pagamento === "contanti"
              ? "Contanti"
              : ordine.metodo_pagamento === "bonifico"
                ? "Bonifico"
                : ordine.metodo_pagamento;

        return (
          <Link
            key={ordine.id}
            href={`/ordini/${ordine.id}`}
          >
            <Card className="rounded-2xl border p-3 shadow-sm transition hover:border-[#1668E8]">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
                  <CheckCircle2 className="h-[22px] w-[22px] text-green-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">
                    {ordine.tesserati?.cognome}{" "}
                    {ordine.tesserati?.nome}
                  </h2>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Pagato con {metodo}
                  </p>
                </div>

              </div>
            </Card>
          </Link>
        );
      })}

      {!ordini?.length && (
        <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-muted-foreground">
          Nessun ordine archiviato
        </Card>
      )}

    </div>
  );
}
