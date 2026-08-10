import Link from "next/link";
import { Plus, UserRound } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function TesseratiPage() {
  const { data: tesserati, error } = await supabase
    .from("tesserati")
    .select("id, nome, cognome, data_nascita")
    .order("cognome", { ascending: true })
    .order("nome", { ascending: true });

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <Card className="rounded-2xl border p-6 text-center">
          <p className="font-semibold">
            Errore nel caricamento dei tesserati
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      <Link href="/tesserati/nuovo">
        <Button className="h-12 w-full rounded-2xl bg-[#1668E8] font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Aggiungi Tesserato
        </Button>
      </Link>

      <div className="flex flex-col gap-3">
        {tesserati?.map((tesserato) => {
          const dataNascita = tesserato.data_nascita
            ? new Date(
                `${tesserato.data_nascita}T00:00:00`
              ).toLocaleDateString("it-IT")
            : null;

          return (
            <Link
              key={tesserato.id}
              href={`/tesserati/${tesserato.id}`}
            >
              <Card className="block rounded-2xl border p-3 shadow-sm transition hover:border-[#1668E8]">
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1668E8]/10">
                    <UserRound className="h-[22px] w-[22px] text-[#1668E8]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {tesserato.cognome}{" "}
                      {tesserato.nome}
                    </p>

                    {dataNascita && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Nato il {dataNascita}
                      </p>
                    )}
                  </div>

                </div>
              </Card>
            </Link>
          );
        })}

        {!tesserati?.length && (
          <Card className="rounded-2xl border-2 border-dashed p-8 text-center text-muted-foreground">
            Nessun tesserato presente
          </Card>
        )}
      </div>

    </div>
  );
}