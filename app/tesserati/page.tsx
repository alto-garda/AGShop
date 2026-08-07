import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";

export default async function TesseratiPage() {
  const { data: tesserati } = await supabase
    .from("tesserati")
    .select("*")
    .order("cognome")
    .order("nome");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      {tesserati?.map((tesserato) => (
        <Card
          key={tesserato.id}
          className="rounded-2xl border-2 p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold">
            {tesserato.cognome} {tesserato.nome}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {tesserato.data_nascita ?? "-"}
          </p>
        </Card>
      ))}

      {!tesserati?.length && (
        <Card className="rounded-2xl border-2 p-8 text-center">
          Nessun tesserato
        </Card>
      )}

    </div>
  );
}
