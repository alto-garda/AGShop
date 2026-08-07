import {
  Database,
  CheckCircle2,
  Server,
  ShieldCheck,
} from "lucide-react";

import { Card } from "@/components/ui/card";

export default function DatabasePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Card className="rounded-3xl border-2 p-6">

        <div className="flex flex-col items-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1668E8]/10">
            <Database className="h-10 w-10 text-[#1668E8]" />
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Database
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            Connessione attiva
          </p>

        </div>

      </Card>

      <Card className="rounded-2xl border-2 p-4">

        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-600" />
          <span>Supabase collegato</span>
        </div>

      </Card>

      <Card className="rounded-2xl border-2 p-4">

        <div className="flex items-center gap-3">
          <Server className="text-[#1668E8]" />
          <span>API raggiungibile</span>
        </div>

      </Card>

      <Card className="rounded-2xl border-2 p-4">

        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#1668E8]" />
          <span>Autenticazione configurata</span>
        </div>

      </Card>

    </div>
  );
}
