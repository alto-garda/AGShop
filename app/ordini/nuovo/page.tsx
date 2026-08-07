"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tesserato = {
  id: string;
  nome: string;
  cognome: string;
};

export default function NuovoOrdinePage() {
  const router = useRouter();

  const [tesserati, setTesserati] = useState<Tesserato[]>([]);
  const [tesseratoId, setTesseratoId] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tesserati")
        .select("*")
        .order("cognome")
        .order("nome");

      setTesserati(data ?? []);
    }

    load();
  }, []);

  async function salva() {
    if (!tesseratoId) return;

    const { error } = await supabase
      .from("ordini")
      .insert({
        tesserato_id: tesseratoId,
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/ordini");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <select
        className="h-14 rounded-2xl border-2 border-slate-300 px-4"
        value={tesseratoId}
        onChange={(e) => setTesseratoId(e.target.value)}
      >
        <option value="">
          Seleziona tesserato
        </option>

        {tesserati.map((t) => (
          <option
            key={t.id}
            value={t.id}
          >
            {t.cognome} {t.nome}
          </option>
        ))}
      </select>

      <Button
        className="h-14 rounded-2xl bg-[#1668E8]"
        onClick={salva}
      >
        Crea Ordine
      </Button>

    </div>
  );
}
