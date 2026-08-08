"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Tesserato = {
  id: string;
  nome: string;
  cognome: string;
};

type Articolo = {
  id: string;
  nome: string;
  categoria: string;
  costo: number;
};

type Taglia = {
  taglia: string;
  giacenza: number;
};

type Riga = {
  articolo_id: string;
  taglia: string | null;
  quantita: number;
};

export default function NuovoOrdinePage() {
  const router = useRouter();
  const supabase = createClient();

  const [tesserati, setTesserati] = useState<Tesserato[]>([]);
  const [articoli, setArticoli] = useState<Articolo[]>([]);
  const [taglie, setTaglie] = useState<Taglia[]>([]);

  const [tesseratoId, setTesseratoId] = useState("");
  const [articoloId, setArticoloId] = useState("");
  const [taglia, setTaglia] = useState("");
  const [quantita, setQuantita] = useState("1");

  const [righe, setRighe] = useState<Riga[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: tesseratiData }, { data: articoliData }] =
        await Promise.all([
          supabase
            .from("tesserati")
            .select("id, nome, cognome")
            .order("cognome")
            .order("nome"),

          supabase
            .from("articoli")
            .select("id, nome, categoria, costo")
            .eq("attivo", true)
            .order("categoria")
            .order("nome"),
        ]);

      setTesserati(tesseratiData ?? []);
      setArticoli(articoliData ?? []);
      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    async function loadTaglie() {
      setTaglie([]);
      setTaglia("");

      if (!articoloId) return;

      const { data } = await supabase
        .from("articolo_taglie")
        .select("taglia, giacenza")
        .eq("articolo_id", articoloId)
        .order("taglia");

      setTaglie(data ?? []);
    }

    loadTaglie();
  }, [articoloId]);

  const articoloSelezionato = useMemo(
    () => articoli.find((item) => item.id === articoloId),
    [articoli, articoloId]
  );

  const totale = useMemo(() => {
    return righe.reduce((sum, riga) => {
      const articolo = articoli.find(
        (item) => item.id === riga.articolo_id
      );

      return sum + Number(articolo?.costo ?? 0) * riga.quantita;
    }, 0);
  }, [righe, articoli]);

  function aggiungiRiga() {
    if (!articoloId) return;

    const qty = Number(quantita);

    if (!Number.isInteger(qty) || qty <= 0) {
      alert("Inserisci una quantità valida.");
      return;
    }

    if (taglie.length > 0 && !taglia) {
      alert("Seleziona una taglia.");
      return;
    }

    const disponibilita =
      taglie.find((item) => item.taglia === taglia)?.giacenza ?? 0;

    if (taglie.length > 0 && qty > disponibilita) {
      alert(`Disponibilità ${taglia}: ${disponibilita}`);
      return;
    }

    const esistente = righe.find(
      (riga) =>
        riga.articolo_id === articoloId &&
        riga.taglia === (taglia || null)
    );

    if (esistente) {
      setRighe(
        righe.map((riga) =>
          riga === esistente
            ? { ...riga, quantita: riga.quantita + qty }
            : riga
        )
      );
    } else {
      setRighe([
        ...righe,
        {
          articolo_id: articoloId,
          taglia: taglia || null,
          quantita: qty,
        },
      ]);
    }

    setArticoloId("");
    setTaglia("");
    setQuantita("1");
  }

  function eliminaRiga(index: number) {
    setRighe(righe.filter((_, i) => i !== index));
  }

  async function salva() {
    if (!tesseratoId) {
      alert("Seleziona un tesserato.");
      return;
    }

    if (righe.length === 0) {
      alert("Aggiungi almeno un articolo.");
      return;
    }

    if (saving) return;

    setSaving(true);

    const { data: ordine, error } = await supabase
      .from("ordini")
      .insert({
        tesserato_id: tesseratoId,
        stato: "inserito",
        note: note.trim() || null,
      })
      .select("id")
      .single();

    if (error || !ordine) {
      alert(error?.message ?? "Errore nella creazione dell'ordine.");
      setSaving(false);
      return;
    }

    const { error: righeError } = await supabase
      .from("ordine_righe")
      .insert(
        righe.map((riga) => ({
          ordine_id: ordine.id,
          articolo_id: riga.articolo_id,
          taglia: riga.taglia,
          quantita: riga.quantita,
        }))
      );

    if (righeError) {
      await supabase
        .from("ordini")
        .delete()
        .eq("id", ordine.id);

      alert(righeError.message);
      setSaving(false);
      return;
    }

    router.push(`/ordini/${ordine.id}`);
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
        <h2 className="mb-4 text-lg font-bold">
          Tesserato
        </h2>

        <select
          value={tesseratoId}
          onChange={(e) => setTesseratoId(e.target.value)}
          className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="">
            Seleziona tesserato
          </option>

          {tesserati.map((tesserato) => (
            <option key={tesserato.id} value={tesserato.id}>
              {tesserato.cognome} {tesserato.nome}
            </option>
          ))}
        </select>
      </Card>

      <Card className="rounded-3xl border-2 p-5">
        <h2 className="mb-4 text-lg font-bold">
          Articolo
        </h2>

        <div className="space-y-3">

          <select
            value={articoloId}
            onChange={(e) => setArticoloId(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">
              Seleziona articolo
            </option>

            {articoli.map((articolo) => (
              <option key={articolo.id} value={articolo.id}>
                {articolo.categoria} — {articolo.nome} — €
                {Number(articolo.costo).toFixed(2)}
              </option>
            ))}
          </select>

          {articoloSelezionato && taglie.length > 0 && (
            <select
              value={taglia}
              onChange={(e) => setTaglia(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="">
                Seleziona taglia
              </option>

              {taglie.map((item) => (
                <option
                  key={item.taglia}
                  value={item.taglia}
                  disabled={item.giacenza <= 0}
                >
                  {item.taglia} — {item.giacenza} disponibili
                </option>
              ))}
            </select>
          )}

          <Input
            type="number"
            min="1"
            value={quantita}
            onChange={(e) => setQuantita(e.target.value)}
            placeholder="Quantità"
          />

          <Button
            type="button"
            onClick={aggiungiRiga}
            className="h-12 w-full rounded-xl bg-[#1668E8]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Aggiungi articolo
          </Button>

        </div>
      </Card>

      {righe.length > 0 && (
        <Card className="rounded-3xl border-2 p-5">

          <h2 className="mb-4 text-lg font-bold">
            Riepilogo
          </h2>

          <div className="space-y-2">

            {righe.map((riga, index) => {
              const articolo = articoli.find(
                (item) => item.id === riga.articolo_id
              );

              const subtotale =
                Number(articolo?.costo ?? 0) *
                riga.quantita;

              return (
                <div
                  key={`${riga.articolo_id}-${riga.taglia}-${index}`}
                  className="flex items-center gap-3 rounded-2xl border-2 p-3"
                >

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {articolo?.nome}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {riga.taglia
                        ? `Taglia ${riga.taglia} · `
                        : ""}
                      {riga.quantita} × €
                      {Number(articolo?.costo ?? 0).toFixed(2)}
                    </p>
                  </div>

                  <span className="font-bold">
                    €{subtotale.toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => eliminaRiga(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                </div>
              );
            })}

          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <span className="font-semibold">
              Totale
            </span>

            <span className="text-2xl font-bold">
              € {totale.toFixed(2)}
            </span>
          </div>

        </Card>
      )}

      <Card className="rounded-3xl border-2 p-5">
        <h2 className="mb-4 text-lg font-bold">
          Note
        </h2>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note ordine..."
          rows={4}
          className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </Card>

      <Button
        onClick={salva}
        disabled={saving || !tesseratoId || righe.length === 0}
        className="h-14 rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
      >
        {saving ? "Salvataggio..." : "Salva Ordine"}
      </Button>

    </div>
  );
}
