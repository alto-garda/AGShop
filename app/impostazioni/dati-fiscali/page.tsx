import { ReceiptText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { CopiaDato } from "@/components/impostazioni/CopiaDato";

const dati = [
  ["Ragione Sociale", "A.S.D. Alto Garda"],
  ["Sede Legale", "Via Capitelli, 11 – 25010 Limone sul Garda (BS)"],
  ["Sede Operativa", "Via Religione, 35 – 25088 Toscolano Maderno (BS)"],
  ["Telefono", "+39 350 5769451"],
  ["Web", "www.asaltogarda.it"],
  ["Mail", "asaltogarda@gmail.com"],
  ["PEC", "asaltogarda@pec.it"],
  ["Partita IVA", "IT04109340986"],
  ["Codice Fiscale", "04109340986"],
  ["SDI Principale", "T9K4ZHO"],
  ["SDI Golee", "KRRH6B9"],
  ["IBAN", "IT 30 Y 08016 54640 000007404438"],
  ["Banca", "Cassa Rurale Alto Garda"],
  ["Legale Rappresentante", "Dante Risatti"],
  ["CF Legale Rappresentante", "RSTDNT80A12H612G"],
  ["Matricola FIGC/LND", "64826"],
  ["Matricola CONI", "64826"],
] as const;

export default function DatiFiscaliPage() {
  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center gap-3 px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1668E8]/10">
          <ReceiptText className="h-5 w-5 text-[#1668E8]" />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Dati Fiscali
          </h1>

          <p className="text-sm text-muted-foreground">
            Dati dell'associazione · sola consultazione
          </p>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border-2 shadow-sm">
        <div className="divide-y">

          {dati.map(([etichetta, valore]) => (
            <div
              key={etichetta}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {etichetta}
                </p>

                <p className="mt-0.5 break-words text-sm font-semibold">
                  {valore}
                </p>
              </div>

              <CopiaDato valore={valore} />
            </div>
          ))}

        </div>
      </Card>

    </div>
  );
}
