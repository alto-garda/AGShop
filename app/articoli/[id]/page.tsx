import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Shirt,
  Hash,
  Tag,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArticoloPage({
  params,
}: Props) {
  const { id } = await params;

  const { data } = await supabase
    .from("articoli")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">

      <Link href="/articoli">
        <Button
          variant="outline"
          className="justify-start rounded-2xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna agli Articoli
        </Button>
      </Link>

      <Card className="rounded-3xl border-2 border-slate-200 p-6">

        <div className="flex flex-col items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1668E8]/10">
            <Shirt className="h-12 w-12 text-[#1668E8]" />
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold">
            {data.nome}
          </h1>

          <div className="mt-8 w-full space-y-4">

            <div className="flex items-center gap-3 rounded-2xl border-2 p-4">
              <Tag className="text-[#1668E8]" />

              <div>
                <p className="text-xs text-slate-500">
                  Categoria
                </p>

                <p className="font-semibold">
                  {data.categoria}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border-2 p-4">
              <Hash className="text-[#1668E8]" />

              <div>
                <p className="text-xs text-slate-500">
                  Codice Fornitore
                </p>

                <p className="font-semibold">
                  {data.codice_fornitore || "-"}
                </p>
              </div>
            </div>

          </div>

        </div>

      </Card>

      <Link href={`/articoli/${id}/modifica`}>
        <Button className="h-14 w-full justify-start rounded-2xl bg-[#1668E8]">
          <Pencil className="mr-3 h-5 w-5" />
          Modifica Articolo
        </Button>
      </Link>

    </div>
  );
}
