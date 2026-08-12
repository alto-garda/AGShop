import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase-server";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteTesseratoButton } from "@/components/tesserati/DeleteTesseratoButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TesseratoPage({
  params,
}: Props) {
  const supabase = await createClient();
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
        <Button
          variant="outline"
          className="justify-start rounded-2xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai Tesserati
        </Button>
      </Link>

      <Card className="rounded-3xl border-2 border-slate-200 p-6 shadow-sm">

        <div className="flex flex-col items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1668E8]/10">
            <UserRound className="h-12 w-12 text-[#1668E8]" />
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold">
            {data.cognome} {data.nome}
          </h1>

          <div className="mt-6 flex w-full items-center gap-3 rounded-2xl border-2 border-slate-200 p-4">
            <Calendar className="text-[#1668E8]" />

            <div>
              <p className="text-xs text-slate-500">
                Data di nascita
              </p>

              <p className="font-semibold">
                {data.data_nascita ?? "-"}
              </p>
            </div>
          </div>

        </div>

      </Card>

      <Link href={`/tesserati/${id}/modifica`}>
        <Button className="h-14 w-full justify-start rounded-2xl bg-[#1668E8]">
          <Pencil className="mr-3 h-5 w-5" />
          Modifica Tesserato
        </Button>
      </Link>

      <DeleteTesseratoButton id={id} />

    </div>
  );
}
