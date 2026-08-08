"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const TAGLIE = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

export default function NuovoArticoloPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [codice, setCodice] = useState("");
  const [costo, setCosto] = useState("");

  const [taglie, setTaglie] = useState<
    { taglia: string; giacenza: string }[]
  >([]);

  const [saving, setSaving] = useState(false);

  function aggiungiTaglia(taglia: string) {
    if (taglie.some((item) => item.taglia === taglia)) return;

    setTaglie([
      ...taglie,
      {
        taglia,
        giacenza: "0",
      },
    ]);
  }

  function rimuoviTaglia(taglia: string) {
    setTaglie(taglie.filter((item) => item.taglia !== taglia));
  }

  function aggiornaGiacenza(taglia: string, giacenza: string) {
    setTaglie(
      taglie.map((item) =>
        item.taglia === taglia
          ? { ...item, giacenza }
          : item
      )
    );
  }

  async function salva() {
    if (!nome.trim() || saving) return;

    setSaving(true);

    const { data: articolo, error } = await supabase
      .from("articoli")
      .insert({
        categoria: categoria.trim(),
        nome: nome.trim(),
        codice_fornitore: codice.trim() || null,
        costo: Number(costo.replace(",", ".")) || 0,
        attivo: true,
      })
      .select()
      .single();

    if (error || !articolo) {
      alert(error?.message ?? "Errore durante il salvataggio");
      setSaving(false);
      return;
    }

    if (taglie.length > 0) {
      const { error: taglieError } = await supabase
        .from("articolo_taglie")
        .insert(
          taglie.map((item) => ({
            articolo_id: articolo.id,
            taglia: item.taglia,
            giacenza: Number(item.giacenza) || 0,
          }))
        );

      if (taglieError) {
        alert(taglieError.message);
        setSaving(false);
        return;
      }
    }

    router.push(`/articoli/${articolo.id}`);
    router.refresh();
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
                  placeholder="Giacenza"
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
                  onClick={() => rimuoviTaglia(item.taglia)}
                  className="text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

              </div>
            ))}

          </div>
        )}

        {taglie.length === 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-sm text-slate-500">
            <Plus className="h-4 w-4" />
            Seleziona le taglie disponibili
          </div>
        )}

      </Card>

      <Button
        className="h-14 rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
        onClick={salva}
        disabled={saving || !nome.trim()}
      >
        {saving ? "Salvataggio..." : "Salva Articolo"}
      </Button>

    </div>
  );
}
