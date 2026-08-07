import {
  Shield,
  Database,
  Lock,
  FileCheck,
} from "lucide-react";

import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Card className="rounded-3xl border-2 p-6">

        <div className="flex flex-col items-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1668E8]/10">
            <Shield className="h-10 w-10 text-[#1668E8]" />
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Privacy
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            Sicurezza dell'applicazione
          </p>

        </div>

      </Card>

      <Card className="rounded-2xl border-2 p-4">

        <div className="flex items-center gap-3">
          <Lock className="text-[#1668E8]" />
          <span>Login protetto con Supabase Auth</span>
        </div>

      </Card>

      <Card className="rounded-2xl border-2 p-4">

        <div className="flex items-center gap-3">
          <Database className="text-[#1668E8]" />
          <span>Dati archiviati su Supabase</span>
        </div>

      </Card>

      <Card className="rounded-2xl border-2 p-4">

        <div className="flex items-center gap-3">
          <FileCheck className="text-[#1668E8]" />
          <span>Backup gestito dal database</span>
        </div>

      </Card>

    </div>
  );
}
