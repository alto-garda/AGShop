import Link from "next/link";
import { UserRound, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

type Props = {
  id: string;
  nome: string;
  cognome: string;
  data_nascita: string | null;
};

export function TesseratoCard({
  id,
  nome,
  cognome,
  data_nascita,
}: Props) {
  return (
    <Link href={`/tesserati/${id}`}>
      <Card className="rounded-2xl border-2 border-slate-200 p-4 shadow-sm transition-all hover:border-[#1668E8] hover:shadow-md">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1668E8]/10">
            <UserRound className="h-6 w-6 text-[#1668E8]" />
          </div>

          <div className="flex-1">

            <h2 className="font-semibold">
              {cognome} {nome}
            </h2>

            <p className="text-sm text-slate-500">
              {data_nascita ?? "-"}
            </p>

          </div>

          <ChevronRight className="text-slate-400" />

        </div>

      </Card>
    </Link>
  );
}
