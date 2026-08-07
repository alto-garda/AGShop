"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ModificaArticoloPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [codice, setCodice] = useState("");

  useEffect(() => {
    async function carica() {
      const { data } = await supabase
        .from("articoli")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) return;

      setCategoria(data.categoria);
      setNome(data.nome);
      setCodice(data.codice_fornitore ?? "");
    }

    carica();
  }, [id]);

  async function salva() {
    await supabase
      .from("articoli")
      .update({
        categoria,
        nome,
        codice_fornitore: codice,
      })
      .eq("id", id);

    router.push(`/articoli/${id}`);
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
        Salva Modifiche
      </Button>

    </div>
  );
}
