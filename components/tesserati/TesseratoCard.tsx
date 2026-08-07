import { Card } from "@/components/ui/card";
import { UserRound } from "lucide-react";

type Props = {
  nome: string;
  cognome: string;
  data_nascita: string | null;
};

export function TesseratoCard({
  nome,
  cognome,
  data_nascita,
}: Props) {
  return (
    <Card className="rounded-2xl border-2 border-slate-200 p-4 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1668E8]/10">
          <UserRound className="h-6 w-6 text-[#1668E8]" />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {cognome} {nome}
          </h2>

          <p className="text-sm text-slate-500">
            {data_nascita ?? "-"}
          </p>
        </div>

      </div>

    </Card>
  );
}
