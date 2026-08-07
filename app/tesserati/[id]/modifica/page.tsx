"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ModificaTesseratoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [dataNascita, setDataNascita] = useState("");

  async function salva() {
    await supabase
      .from("tesserati")
      .update({
        nome,
        cognome,
        data_nascita: dataNascita || null,
      })
      .eq("id", id);

    router.push(`/tesserati/${id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <Input
        placeholder="Cognome"
        value={cognome}
        onChange={(e) => setCognome(e.target.value)}
      />

      <Input
        type="date"
        value={dataNascita}
        onChange={(e) => setDataNascita(e.target.value)}
      />

      <Button
        className="h-14 rounded-2xl bg-[#1668E8]"
        onClick={salva}
      >
        Salva Modifiche
      </Button>

    </div>
  );
}
