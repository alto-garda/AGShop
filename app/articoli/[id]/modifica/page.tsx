"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const TAGLIE = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

type Taglia = {
  id?: string;
  taglia: string;
  giacenza: number;
};

export default function ModificaArticoloPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const id = params.id as string;

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [codice, setCodice] = useState("");
  const [costo, setCosto] = useState("");
  const [taglie, setTaglie] = useState<Taglia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: articolo, error } = await supabase
        .from("articoli")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !articolo) {
        router.push("/articoli");
        return;
      }

      const { data: datiTaglie } = await supabase
        .from("articolo_taglie")
        .select("*")
        .eq("articolo_id", id)
        .order("taglia");

      setNome(articolo.nome ?? "");
      setCategoria(articolo.categoria ?? "");
      setCodice(articolo.codice_fornitore ?? "");
      setCosto(String(articolo.costo ?? 0));

      setTaglie(
        (datiTaglie ?? []).map((item) => ({
          id: item.id,
          taglia: item.taglia,
          giacenza: item.giacenza ?? 0,
        }))
      );

      setLoading(false);
    }

    load();
  }, [id]);

  function aggiungiTaglia(taglia: string) {
    if (taglie.some((item) => item.taglia === taglia)) return;

    setTaglie([
      ...taglie,
      {
        taglia,
        giacenza: 0,
      },
    ]);
  }

  function rimuoviTaglia(taglia: string) {
    setTaglie(
      taglie.filter((item) => item.taglia !== taglia)
    );
  }

  function aggiornaGiacenza(
    taglia: string,
    valore: string
  ) {
    setTaglie(
      taglie.map((item) =>
        item.taglia === taglia
          ? {
              ...item,
              giacenza: Number(valore) || 0,
            }
          : item
      )
    );
  }

  async function salva() {
    if (!nome.trim() || saving) return;

    setSaving(true);

    const { error } = await supabase
      .from("articoli")
      .update({
        nome: nome.trim(),
        categoria: categoria.trim(),
        codice_fornitore: codice.trim() || null,
        costo: Number(costo.replace(",", ".")) || 0,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from("articolo_taglie")
      .delete()
      .eq("articolo_id", id);

    if (deleteError) {
      alert(deleteError.message);
      setSaving(false);
      return;
    }

    if (taglie.length > 0) {
      const { error: insertError } = await supabase
        .from("articolo_taglie")
        .insert(
          taglie.map((item) => ({
            articolo_id: id,
            taglia: item.taglia,
            giacenza: Math.max(0, item.giacenza),
          }))
        );

      if (insertError) {
        alert(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push(`/articoli/${id}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Caricamento...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      <Card className="rounded-3xl border-2 p-5">

        <div className="space-y-4">

          <Input
            placeholder="Nome articolo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <Input
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <Input
            placeholder="Codice fornitore"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
          />

          <Input
            placeholder="Costo (€)"
            type="number"
            min="0"
            step="0.01"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
          />

        </div>

      </Card>

      <Card className="rounded-3xl border-2 p-5">

        <h2 className="mb-4 text-lg font-bold">
          Taglie
        </h2>

        <div className="flex flex-wrap gap-2">

          {TAGLIE.map((taglia) => {
            const presente = taglie.some(
              (item) => item.taglia === taglia
            );

            return (
              <Button
                key={taglia}
                type="button"
                variant={presente ? "default" : "outline"}
                className="h-10 min-w-12 rounded-xl"
                onClick={() =>
                  presente
                    ? rimuoviTaglia(taglia)
                    : aggiungiTaglia(taglia)
                }
              >
                {taglia}
              </Button>
            );
          })}

        </div>

        {taglie.length > 0 && (
          <div className="mt-5 space-y-2">

            {taglie.map((item) => (
              <div
                key={item.taglia}
                className="flex items-center gap-3 rounded-2xl border-2 p-3"
              >

                <span className="w-12 font-bold">
                  {item.taglia}
                </span>

                <Input
                  type="number"
                  min="0"
                  value={item.giacenza}
                  onChange={(e) =>
                    aggiornaGiacenza(
                      item.taglia,
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    rimuoviTaglia(item.taglia)
                  }
                  className="text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

              </div>
            ))}

          </div>
        )}

      </Card>

      <Button
        className="h-14 rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
        onClick={salva}
        disabled={saving || !nome.trim()}
      >
        {saving ? "Salvataggio..." : "Salva Modifiche"}
      </Button>

    </div>
  );
}
