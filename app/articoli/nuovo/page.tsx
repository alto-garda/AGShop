"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NuovoArticoloPage() {
  const router = useRouter();

  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [codice, setCodice] = useState("");

  async function salva() {
    const { error } = await supabase
      .from("articoli")
      .insert({
        categoria,
        nome,
        codice_fornitore: codice,
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/articoli");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Input
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />

      <Input
        placeholder="Nome articolo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <Input
        placeholder="Codice fornitore"
        value={codice}
        onChange={(e) => setCodice(e.target.value)}
      />

      <Button
        className="h-14 rounded-2xl bg-[#1668E8]"
        onClick={salva}
      >
        Salva Articolo
      </Button>

    </div>
  );
}
