"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ShoppingCart, X } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Tesserato = {
  id: string;
  nome: string;
  cognome: string;
  data_nascita: string | null;
};

type Articolo = {
  id: string;
  nome: string;
  categoria: string;
  costo: number;
  giacenza: number;
};

type Taglia = {
  taglia: string;
  giacenza: number;
};

type Kit = {
  id: string;
  nome: string;
  prezzo: number;
};

type KitRiga = {
  id: string;
  articolo_id: string;
  quantita: number;
  tipo_taglia: "abbigliamento" | "calzettoni" | "nessuna";
  articoli: {
    id: string;
    nome: string;
    categoria: string;
  } | null;
};

type Riga = {
  id: string;
  articoloId: string;
  nome: string;
  taglia: string | null;
  quantita: number;
  prezzo: number;
  kitId?: string;
  kitNome?: string;
};

const TAGLIE_ABBIGLIAMENTO = [
  "2XS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
];

const TAGLIE_CALZETTONI = [
  "KID",
  "BOY",
  "MAN",
];

export default function NuovoOrdinePage() {
  const router = useRouter();

  const [tesserati, setTesserati] = useState<Tesserato[]>([]);
  const [articoli, setArticoli] = useState<Articolo[]>([]);
  const [kit, setKit] = useState<Kit[]>([]);

  const [tesseratoId, setTesseratoId] = useState("");
  const [cercaTesserato, setCercaTesserato] = useState("");

  const [tipo, setTipo] = useState<"singoli" | "kit">("singoli");

  const [articoloId, setArticoloId] = useState("");
  const [taglia, setTaglia] = useState("");
  const [quantita, setQuantita] = useState("1");

  const [kitId, setKitId] = useState("");
  const [tagliaKit, setTagliaKit] = useState("");
  const [tagliaCalzettoni, setTagliaCalzettoni] = useState("");

  const [righe, setRighe] = useState<Riga[]>([]);
  const [saving, setSaving] = useState(false);

  const [taglie, setTaglie] = useState<Taglia[]>([]);
  const [kitRighe, setKitRighe] = useState<KitRiga[]>([]);

  useEffect(() => {
    async function load() {
      const [
        { data: tesseratiData },
        { data: articoliData },
        { data: kitData },
      ] = await Promise.all([
        supabase
          .from("tesserati")
          .select("id,nome,cognome,data_nascita")
          .order("cognome")
          .order("nome"),

        supabase
          .from("articoli")
          .select("id,nome,categoria,costo,giacenza")
          .eq("attivo", true)
          .order("categoria")
          .order("nome"),

        supabase
          .from("kit")
          .select("id,nome,prezzo")
          .eq("attivo", true)
          .order("nome"),
      ]);

      setTesserati(tesseratiData ?? []);
      setArticoli(articoliData ?? []);
      setKit(kitData ?? []);
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
        .select("taglia,giacenza")
        .eq("articolo_id", articoloId)
        .order("taglia");

      setTaglie(data ?? []);
    }

    loadTaglie();
  }, [articoloId]);

  useEffect(() => {
    async function loadKitRighe() {
      setKitRighe([]);
      setTagliaKit("");
      setTagliaCalzettoni("");

      if (!kitId) return;

      const { data } = await supabase
        .from("kit_righe")
        .select(`
          id,
          articolo_id,
          quantita,
          tipo_taglia,
          articoli (
            id,
            nome,
            categoria
          )
        `)
        .eq("kit_id", kitId);

      setKitRighe((data ?? []) as unknown as KitRiga[]);
    }

    loadKitRighe();
  }, [kitId]);

  const tesseratiFiltrati = useMemo(() => {
    const q = cercaTesserato.trim().toLowerCase();

    if (!q) return [];

    return tesserati
      .filter((t) =>
        `${t.cognome} ${t.nome}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 15);
  }, [tesserati, cercaTesserato]);

  const tesserato = tesserati.find(
    (t) => t.id === tesseratoId
  );

  const articolo = articoli.find(
    (a) => a.id === articoloId
  );

  const kitSelezionato = kit.find(
    (k) => k.id === kitId
  );

  const totale = righe.reduce(
    (sum, riga) => sum + riga.prezzo * riga.quantita,
    0
  );

  function aggiungiSingolo() {
    if (!articolo) {
      alert("Seleziona un articolo.");
      return;
    }

    const qty = Number(quantita);

    if (!Number.isInteger(qty) || qty <= 0) {
      alert("Inserisci una quantità valida.");
      return;
    }

    if (taglie.length > 0 && !taglia) {
      alert("Seleziona una taglia.");
      return;
    }

    setRighe((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        articoloId: articolo.id,
        nome: articolo.nome,
        taglia: taglie.length > 0 ? taglia : null,
        quantita: qty,
        prezzo: Number(articolo.costo),
      },
    ]);

    setArticoloId("");
    setTaglia("");
    setQuantita("1");
  }

  function aggiungiKit() {
    if (!kitSelezionato) {
      alert("Seleziona un kit.");
      return;
    }

    const componenti = kitRighe.filter(
      (r) => r.tipo_taglia !== "nessuna"
    );

    const richiedeAbbigliamento = componenti.some(
      (r) => r.tipo_taglia === "abbigliamento"
    );

    const richiedeCalzettoni = componenti.some(
      (r) => r.tipo_taglia === "calzettoni"
    );

    if (richiedeAbbigliamento && !tagliaKit) {
      alert("Seleziona la taglia dell'abbigliamento.");
      return;
    }

    if (richiedeCalzettoni && !tagliaCalzettoni) {
      alert("Seleziona la taglia dei calzettoni.");
      return;
    }

    const nuoveRighe: Riga[] = kitRighe.map((riga) => {
      const componente = riga.articoli;

      if (!componente) {
        throw new Error("Componente kit non trovato.");
      }

      const tagliaComponente =
        riga.tipo_taglia === "abbigliamento"
          ? tagliaKit
          : riga.tipo_taglia === "calzettoni"
            ? tagliaCalzettoni
            : null;

      return {
        id: crypto.randomUUID(),
        articoloId: riga.articolo_id,
        nome: componente.nome,
        taglia: tagliaComponente,
        quantita: riga.quantita,
        prezzo: 0,
        kitId: kitSelezionato.id,
        kitNome: kitSelezionato.nome,
      };
    });

    setRighe((current) => [
      ...current,
      ...nuoveRighe,
    ]);

    setKitId("");
    setTagliaKit("");
    setTagliaCalzettoni("");
  }

  function rimuoviRiga(id: string) {
    setRighe((current) =>
      current.filter((riga) => riga.id !== id)
    );
  }

  async function salvaOrdine() {
    if (!tesseratoId) {
      alert("Seleziona un tesserato.");
      return;
    }

    if (!righe.length) {
      alert("Aggiungi almeno un articolo o un kit.");
      return;
    }

    setSaving(true);

    try {
      const { data: ordine, error } = await supabase
        .from("ordini")
        .insert({
          tesserato_id: tesseratoId,
          stato: "inserito",
        })
        .select("id")
        .single();

      if (error || !ordine) {
        throw new Error(
          error?.message ?? "Errore nella creazione dell'ordine."
        );
      }

      const righeDaInserire = righe.map((riga) => ({
        ordine_id: ordine.id,
        articolo_id: riga.articoloId,
        taglia: riga.taglia,
        quantita: riga.quantita,
        quantita_consegnata: 0,
      }));

      const { error: righeError } = await supabase
        .from("ordine_righe")
        .insert(righeDaInserire);

      if (righeError) {
        throw new Error(righeError.message);
      }

      const kitGroups = new Map<
        string,
        { quantita: number; prezzo: number }
      >();

      for (const riga of righe) {
        if (!riga.kitId) continue;

        const current = kitGroups.get(riga.kitId);

        if (current) {
          current.quantita = Math.max(
            current.quantita,
            1
          );
        } else {
          const selectedKit = kit.find(
            (k) => k.id === riga.kitId
          );

          kitGroups.set(riga.kitId, {
            quantita: 1,
            prezzo: Number(selectedKit?.prezzo ?? 0),
          });
        }
      }

      for (const [
        selectedKitId,
        value,
      ] of kitGroups) {
        const { error: kitError } = await supabase
          .from("ordine_kit")
          .insert({
            ordine_id: ordine.id,
            kit_id: selectedKitId,
            quantita: value.quantita,
            prezzo_unitario: value.prezzo,
          });

        if (kitError) {
          throw new Error(kitError.message);
        }
      }

      router.push(`/ordini/${ordine.id}`);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Errore durante il salvataggio."
      );
    } finally {
      setSaving(false);
    }
  }

  const righeKit = righe.filter((r) => r.kitId);

  return (
    <div className="flex flex-col gap-4 pb-4">

      <Button
        variant="outline"
        className="w-fit rounded-2xl"
        onClick={() => router.push("/ordini")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Ordini
      </Button>

      <Card className="rounded-3xl border-2 p-5">

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1668E8]/10">
            <ShoppingCart className="h-6 w-6 text-[#1668E8]" />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Nuovo Ordine
            </h1>
            <p className="text-sm text-muted-foreground">
              Seleziona il tesserato e aggiungi ciò che ordina.
            </p>
          </div>
        </div>

      </Card>

      <Card className="rounded-3xl border-2 p-5">

        <h2 className="mb-3 font-semibold">
          Tesserato
        </h2>

        {tesserato ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#1668E8] bg-[#1668E8]/5 p-4">

            <div>
              <p className="font-semibold">
                {tesserato.cognome} {tesserato.nome}
              </p>

              {tesserato.data_nascita && (
                <p className="text-sm text-muted-foreground">
                  {new Date(
                    `${tesserato.data_nascita}T00:00:00`
                  ).toLocaleDateString("it-IT")}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setTesseratoId("");
                setCercaTesserato("");
              }}
            >
              Cambia
            </Button>

          </div>
        ) : (
          <div className="relative">

            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

            <Input
              value={cercaTesserato}
              onChange={(e) =>
                setCercaTesserato(e.target.value)
              }
              placeholder="Cerca nome o cognome..."
              className="h-12 rounded-2xl pl-10"
            />

            {cercaTesserato.trim() && (
              <div className="mt-2 max-h-64 overflow-y-auto rounded-2xl border-2 bg-background">

                {tesseratiFiltrati.length ? (
                  tesseratiFiltrati.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full border-b p-4 text-left last:border-b-0 hover:bg-muted"
                      onClick={() => {
                        setTesseratoId(item.id);
                        setCercaTesserato("");
                      }}
                    >
                      <span className="font-medium">
                        {item.cognome} {item.nome}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">
                    Nessun tesserato trovato.
                  </p>
                )}

              </div>
            )}

          </div>
        )}

      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={tipo === "singoli" ? "default" : "outline"}
          className="h-12 rounded-2xl"
          onClick={() => setTipo("singoli")}
        >
          Articoli singoli
        </Button>

        <Button
          variant={tipo === "kit" ? "default" : "outline"}
          className="h-12 rounded-2xl"
          onClick={() => setTipo("kit")}
        >
          Kit
        </Button>
      </div>

      {tipo === "singoli" ? (
        <Card className="rounded-3xl border-2 p-5">

          <h2 className="mb-4 font-semibold">
            Aggiungi articolo
          </h2>

          <div className="space-y-4">

            <select
              value={articoloId}
              onChange={(e) =>
                setArticoloId(e.target.value)
              }
              className="h-12 w-full rounded-xl border bg-background px-3 text-sm"
            >
              <option value="">
                Seleziona articolo
              </option>

              {articoli.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.categoria} — {item.nome}
                </option>
              ))}
            </select>

            {articolo && (
              <p className="text-sm text-muted-foreground">
                Disponibilità attuale:{" "}
                {taglie.length
                  ? taglia
                    ? taglie.find(
                        (t) => t.taglia === taglia
                      )?.giacenza ?? 0
                    : "seleziona taglia"
                  : articolo.giacenza}
              </p>
            )}

            {taglie.length > 0 && (
              <select
                value={taglia}
                onChange={(e) =>
                  setTaglia(e.target.value)
                }
                className="h-12 w-full rounded-xl border bg-background px-3 text-sm"
              >
                <option value="">
                  Seleziona taglia
                </option>

                {taglie.map((item) => (
                  <option
                    key={item.taglia}
                    value={item.taglia}
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
              onChange={(e) =>
                setQuantita(e.target.value)
              }
              className="h-12 rounded-xl"
            />

            <Button
              className="h-12 w-full rounded-2xl bg-[#1668E8]"
              onClick={aggiungiSingolo}
            >
              Aggiungi articolo
            </Button>

          </div>

        </Card>
      ) : (
        <Card className="rounded-3xl border-2 p-5">

          <h2 className="mb-4 font-semibold">
            Aggiungi kit
          </h2>

          <div className="space-y-4">

            <select
              value={kitId}
              onChange={(e) => setKitId(e.target.value)}
              className="h-12 w-full rounded-xl border bg-background px-3 text-sm"
            >
              <option value="">
                Seleziona kit
              </option>

              {kit.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.nome} — €
                  {Number(item.prezzo).toFixed(2)}
                </option>
              ))}
            </select>

            {kitSelezionato && (
              <>
                <div className="rounded-2xl bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    Prezzo kit
                  </p>

                  <p className="text-2xl font-bold">
                    €{Number(kitSelezionato.prezzo).toFixed(2)}
                  </p>
                </div>

                {kitRighe.some(
                  (r) => r.tipo_taglia === "abbigliamento"
                ) && (
                  <select
                    value={tagliaKit}
                    onChange={(e) =>
                      setTagliaKit(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border bg-background px-3 text-sm"
                  >
                    <option value="">
                      Taglia abbigliamento
                    </option>

                    {TAGLIE_ABBIGLIAMENTO.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                )}

                {kitRighe.some(
                  (r) => r.tipo_taglia === "calzettoni"
                ) && (
                  <select
                    value={tagliaCalzettoni}
                    onChange={(e) =>
                      setTagliaCalzettoni(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border bg-background px-3 text-sm"
                  >
                    <option value="">
                      Taglia calzettoni
                    </option>

                    {TAGLIE_CALZETTONI.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                )}

                <div className="rounded-2xl border p-4">
                  <p className="mb-3 text-sm font-semibold">
                    Composizione
                  </p>

                  <div className="space-y-2">
                    {kitRighe.map((riga) => (
                      <div
                        key={riga.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {riga.articoli?.nome}
                        </span>

                        <span className="font-semibold">
                          ×{riga.quantita}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="h-12 w-full rounded-2xl bg-[#1668E8]"
                  onClick={aggiungiKit}
                >
                  Aggiungi kit
                </Button>
              </>
            )}

          </div>

        </Card>
      )}

      {righe.length > 0 && (
        <Card className="rounded-3xl border-2 p-5">

          <h2 className="mb-4 font-semibold">
            Riepilogo
          </h2>

          <div className="space-y-2">

            {righe.map((riga) => (
              <div
                key={riga.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >

                <div className="min-w-0">
                  <p className="font-medium">
                    {riga.nome}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {riga.taglia
                      ? `Taglia ${riga.taglia} · `
                      : ""}
                    ×{riga.quantita}
                    {riga.kitNome
                      ? ` · ${riga.kitNome}`
                      : ""}
                  </p>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() =>
                    rimuoviRiga(riga.id)
                  }
                >
                  <X className="h-4 w-4" />
                </Button>

              </div>
            ))}

          </div>

          {righeKit.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Il prezzo dei kit viene applicato al kit completo,
              non ai singoli componenti.
            </p>
          )}

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <span className="font-semibold">
              Totale
            </span>

            <span className="text-2xl font-bold">
              €{totale.toFixed(2)}
            </span>
          </div>

        </Card>
      )}

      <Button
        disabled={
          saving ||
          !tesseratoId ||
          righe.length === 0
        }
        onClick={salvaOrdine}
        className="h-14 rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
      >
        {saving ? "Salvataggio..." : "Crea Ordine"}
      </Button>

    </div>
  );
}
