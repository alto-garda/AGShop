"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopiaDato({ valore }: { valore: string }) {
  const [copiato, setCopiato] = useState(false);

  async function copia() {
    await navigator.clipboard.writeText(valore);
    setCopiato(true);

    setTimeout(() => {
      setCopiato(false);
    }, 1500);
  }

  return (
    <button
      type="button"
      onClick={copia}
      aria-label={`Copia ${valore}`}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#1668E8]/10 hover:text-[#1668E8]"
    >
      {copiato ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}
