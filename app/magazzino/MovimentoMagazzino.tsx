"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, Minus, Plus, X } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Articolo = {
  id: string;
  nome: string;
  categoria: string;
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
  const [quantita, setQuantita] = useState(1);
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);

  const [articoloOpen, setArticoloOpen] = useState(false);

  const isCarico = tipo === "carico";
  const articolo = articoli.find((item) => item.id === articoloId);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("articoli")
        .select("id, nome, categoria")
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

      if (error) return;

      const righe = (data ?? []).map((item) => ({
        taglia: item.taglia,
        giacenza: Number(item.giacenza ?? 0),
      }));

      if (righe.length === 0) {
        setTaglie([{ taglia: "Unica", giacenza: 0 }]);
        setTaglia("Unica");
      } else {
        setTaglie(righe);
      }
    }

    loadTaglie();
  }, [articoloId]);

  const disponibilita =
    taglie.find((item) => item.taglia === taglia)?.giacenza ?? 0;

  function selezionaArticolo(id: string) {
    setArticoloId(id);
    setQuantita(1);
    setArticoloOpen(false);
  }

  function cambiaQuantita(delta: number) {
    setQuantita((value) => {
      const nuova = Math.max(1, value + delta);

      if (!isCarico && taglia && nuova > disponibilita) {
        return disponibilita > 0 ? disponibilita : 1;
      }

      return nuova;
    });
  }

  async function salva() {
    if (!articoloId) {
      alert("Seleziona un articolo.");
      return;
    }

    if (!taglia) {
      alert("Seleziona una taglia.");
      return;
    }

    if (!Number.isInteger(quantita) || quantita <= 0) {
      alert("Inserisci una quantità valida.");
      return;
    }

    if (!isCarico && quantita > disponibilita) {
      alert(`Giacenza disponibile: ${disponibilita}`);
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.rpc("movimento_magazzino", {
        p_articolo_id: articoloId,
        p_taglia: taglia,
        p_tipo: tipo,
        p_quantita: quantita,
        p_nota: nota.trim() || null,
      });

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

  return (
    <div className="space-y-4">
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
              {isCarico ? "Carico Magazzino" : "Scarico Magazzino"}
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
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Articolo
            </label>

            <Button
              type="button"
              variant="outline"
              onClick={() => setArticoloOpen(true)}
              className="h-14 w-full justify-between rounded-2xl px-4 text-left"
            >
              <span className={articolo ? "" : "text-muted-foreground"}>
                {articolo
                  ? `${articolo.categoria} — ${articolo.nome}`
                  : "Seleziona articolo"}
              </span>

              <span className="text-[#1668E8]">⌄</span>
            </Button>
          </div>

          {taglie.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Taglia
              </label>

              <div className="grid grid-cols-4 gap-2">
                {taglie.map((item) => {
                  const selected = item.taglia === taglia;
                  const disabled =
                    !isCarico && item.giacenza <= 0;

                  return (
                    <button
                      key={item.taglia}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setTaglia(item.taglia);

                        if (
                          !isCarico &&
                          quantita > item.giacenza
                        ) {
                          setQuantita(
                            item.giacenza > 0
                              ? item.giacenza
                              : 1
                          );
                        }
                      }}
                      className={`rounded-xl border-2 px-2 py-3 text-sm font-semibold transition ${
                        selected
                          ? "border-[#1668E8] bg-[#1668E8] text-white"
                          : "border-border bg-background hover:border-[#1668E8]"
                      } ${
                        disabled
                          ? "cursor-not-allowed opacity-35"
                          : ""
                      }`}
                    >
                      {item.taglia}
                    </button>
                  );
                })}
              </div>

              {taglia && (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Giacenza attuale:{" "}
                  <span className="font-semibold">
                    {disponibilita}
                  </span>
                </p>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-semibold">
              Quantità
            </p>

            <div className="flex items-center justify-center gap-6 rounded-2xl bg-muted p-4">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-14 w-14 rounded-2xl"
                disabled={quantita <= 1}
                onClick={() => cambiaQuantita(-1)}
              >
                <Minus className="h-6 w-6" />
              </Button>

              <span className="min-w-12 text-center text-3xl font-bold">
                {quantita}
              </span>

              <Button
                type="button"
                size="icon"
                className="h-14 w-14 rounded-2xl"
                disabled={
                  !isCarico &&
                  !!taglia &&
                  quantita >= disponibilita
                }
                onClick={() => cambiaQuantita(1)}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
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
              className="w-full resize-none rounded-2xl border border-input bg-background p-3 text-sm outline-none focus:border-[#1668E8]"
            />
          </div>
        </div>
      </Card>

      <Button
        onClick={salva}
        disabled={saving}
        className="h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold text-white hover:bg-[#0F5BD6]"
      >
        {saving
          ? "Salvataggio..."
          : isCarico
            ? "Conferma Carico"
            : "Conferma Scarico"}
      </Button>

      {articoloOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
          <div className="flex h-[min(720px,85vh)] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-background shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Magazzino
                </p>

                <h2 className="text-xl font-bold">
                  Seleziona articolo
                </h2>
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => setArticoloOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {articoli.map((item) => {
                const selected = item.id === articoloId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selezionaArticolo(item.id)}
                    className={`mb-2 flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition ${
                      selected
                        ? "border-[#1668E8] bg-[#1668E8]/10"
                        : "border-border bg-background hover:border-[#1668E8]"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.categoria}
                      </p>

                      <p className="mt-1 font-semibold">
                        {item.nome}
                      </p>
                    </div>

                    {selected && (
                      <Check className="h-5 w-5 text-[#1668E8]" />
                    )}
                  </button>
                );
              })}

              {!articoli.length && (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  Nessun articolo disponibile.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
