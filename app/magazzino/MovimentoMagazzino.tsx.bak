"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Articolo = {
  id: string;
  nome: string;
  categoria: string;
  giacenza: number;
};

type Taglia = {
  taglia: string;
  giacenza: number;
};

export default function MovimentoMagazzino({
  tipo,
}: {
  tipo: "carico" | "scarico";
}) {
  const router = useRouter();
  const supabase = createClient();

  const [articoli, setArticoli] = useState<Articolo[]>([]);
  const [taglie, setTaglie] = useState<Taglia[]>([]);

  const [articoloId, setArticoloId] = useState("");
  const [taglia, setTaglia] = useState("");
  const [quantita, setQuantita] = useState("1");
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("articoli")
        .select("id, nome, categoria, giacenza")
        .eq("attivo", true)
        .order("categoria")
        .order("nome");

      if (!error) {
        setArticoli(data ?? []);
      }
    }

    load();
  }, []);

  useEffect(() => {
    async function loadTaglie() {
      setTaglie([]);
      setTaglia("");

      if (!articoloId) return;

      const { data, error } = await supabase
        .from("articolo_taglie")
        .select("taglia, giacenza")
        .eq("articolo_id", articoloId)
        .order("taglia");

      if (!error) {
        setTaglie(data ?? []);
      }
    }

    loadTaglie();
  }, [articoloId]);

  const articolo = articoli.find(
    (item) => item.id === articoloId
  );

  async function salva() {
    const qty = Number(quantita);

    if (!articoloId) {
      alert("Seleziona un articolo.");
      return;
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      alert("Inserisci una quantità valida.");
      return;
    }

    if (taglie.length > 0 && !taglia) {
      alert("Seleziona una taglia.");
      return;
    }

    const disponibilita =
      taglie.length > 0
        ? taglie.find((item) => item.taglia === taglia)?.giacenza ?? 0
        : articolo?.giacenza ?? 0;

    if (tipo === "scarico" && qty > disponibilita) {
      alert(`Giacenza disponibile: ${disponibilita}`);
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.rpc(
        "movimento_magazzino",
        {
          p_articolo_id: articoloId,
          p_taglia: taglia || null,
          p_tipo: tipo,
          p_quantita: qty,
          p_nota: nota.trim() || null,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Errore durante il movimento."
      );
    } finally {
      setSaving(false);
    }
  }

  const isCarico = tipo === "carico";

  return (
    <div className="flex flex-col gap-4">

      <Card className="rounded-3xl border-2 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1668E8]/10">
            {isCarico ? (
              <ArrowUp className="h-6 w-6 text-[#1668E8]" />
            ) : (
              <ArrowDown className="h-6 w-6 text-[#1668E8]" />
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold">
              {isCarico
                ? "Carico Magazzino"
                : "Scarico Magazzino"}
            </h1>

            <p className="text-sm text-muted-foreground">
              {isCarico
                ? "Aggiungi quantità al magazzino"
                : "Rimuovi quantità dal magazzino"}
            </p>
          </div>

        </div>

      </Card>

      <Card className="rounded-3xl border-2 p-5">

        <div className="space-y-4">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Articolo
            </label>

            <select
              value={articoloId}
              onChange={(e) => setArticoloId(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="">
                Seleziona articolo
              </option>

              {articoli.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.categoria} — {item.nome}
                </option>
              ))}
            </select>
          </div>

          {taglie.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Taglia
              </label>

              <select
                value={taglia}
                onChange={(e) => setTaglia(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="">
                  Seleziona taglia
                </option>

                {taglie.map((item) => (
                  <option key={item.taglia} value={item.taglia}>
                    {item.taglia} — {item.giacenza} disponibili
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Quantità
            </label>

            <Input
              type="number"
              min="1"
              value={quantita}
              onChange={(e) => setQuantita(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nota
            </label>

            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Motivo del movimento..."
              rows={3}
              className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm"
            />
          </div>

        </div>

      </Card>

      {articoloId && (
        <Card className="rounded-3xl border-2 p-5">

          <p className="text-sm text-muted-foreground">
            Giacenza attuale
          </p>

          <p className="mt-1 text-3xl font-bold">
            {taglie.length > 0
              ? taglia
                ? taglie.find(
                    (item) => item.taglia === taglia
                  )?.giacenza ?? 0
                : "—"
              : articolo?.giacenza ?? 0}
          </p>

        </Card>
      )}

      <Button
        onClick={salva}
        disabled={saving}
        className="h-14 rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
      >
        {saving
          ? "Salvataggio..."
          : isCarico
            ? "Conferma Carico"
            : "Conferma Scarico"}
      </Button>

    </div>
  );
}
