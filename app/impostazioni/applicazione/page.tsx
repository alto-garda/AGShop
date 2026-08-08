import {
  Database,
  ShieldCheck,
  LockKeyhole,
  Info,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const sezioni = [
  {
    titolo: "Database",
    descrizione: "Dati dell'applicazione",
    valore: "Supabase",
    icona: Database,
  },
  {
    titolo: "Sicurezza",
    descrizione: "Accesso e protezione dei dati",
    valore: "Autenticazione attiva",
    icona: ShieldCheck,
  },
  {
    titolo: "Privacy",
    descrizione: "Gestione dei dati dell'associazione",
    valore: "Dati protetti",
    icona: LockKeyhole,
  },
];

export default function ApplicazionePage() {
  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center gap-3 px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1668E8]/10">
          <Info className="h-5 w-5 text-[#1668E8]" />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Applicazione
          </h1>

          <p className="text-sm text-muted-foreground">
            Database, privacy e sicurezza
          </p>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border-2 shadow-sm">
        <div className="divide-y">

          {sezioni.map((sezione) => {
            const Icon = sezione.icona;

            return (
              <div
                key={sezione.titolo}
                className="flex items-center gap-3 px-3 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Icon className="h-5 w-5 text-[#1668E8]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {sezione.titolo}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {sezione.descrizione}
                  </p>
                </div>

                <p className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {sezione.valore}
                </p>
              </div>
            );
          })}

        </div>
      </Card>

      <p className="px-1 text-xs text-muted-foreground">
        Questa sezione è informativa. Le impostazioni tecniche del database
        e della sicurezza non sono modificabili dall'app.
      </p>

    </div>
  );
}
