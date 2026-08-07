import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TesseratoPage({ params }: Props) {
  const { id } = await params;

  const { data } = await supabase
    .from("tesserati")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">

      <Link href="/tesserati">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna
        </Button>
      </Link>

      <Card className="rounded-2xl border-2 p-5">

        <h1 className="text-2xl font-bold">
          {data.cognome} {data.nome}
        </h1>

        <div className="mt-6 space-y-5">

          <div>
            <p className="text-xs text-slate-500">Nome</p>
            <p>{data.nome}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Cognome</p>
            <p>{data.cognome}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Data nascita</p>
            <p>{data.data_nascita ?? "-"}</p>
          </div>

        </div>

      </Card>

      <Link href={`/tesserati/${id}/modifica`}>
        <Button className="h-14 w-full justify-start rounded-2xl bg-[#1668E8]">
          <Pencil className="mr-3 h-5 w-5" />
          Modifica
        </Button>
      </Link>

      <Button
        variant="destructive"
        className="h-14 justify-start rounded-2xl"
      >
        <Trash2 className="mr-3 h-5 w-5" />
        Elimina
      </Button>

    </div>
  );
}
