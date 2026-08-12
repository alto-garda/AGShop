"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

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

const CATEGORIE = [
  "Allenamento",
  "Rappresentanza",
  "Merchandising",
];

export default function NuovoOrdinePage() {
  const router = useRouter();

  const [tesserati, setTesserati] = useState<Tesserato[]>([]);
  const [articoli, setArticoli] = useState<Articolo[]>([]);
  const [kit, setKit] = useState<Kit[]>([]);

  const [tesseratoId, setTesseratoId] = useState("");
  const [cercaTesserato, setCercaTesserato] = useState("");
  const [tesseratoOpen, setTesseratoOpen] = useState(false);

  const [articoloOpen, setArticoloOpen] = useState(false);
  const [articoloSelezionato, setArticoloSelezionato] =
    useState<Articolo | null>(null);

  const [taglie, setTaglie] = useState<Taglia[]>([]);
  const [tagliaSelezionata, setTagliaSelezionata] = useState("");
  const [quantita, setQuantita] = useState(1);

  const [kitOpen, setKitOpen] = useState(false);
  const [kitId, setKitId] = useState("");
  const [tagliaKit, setTagliaKit] = useState("");
  const [tagliaCalzettoni, setTagliaCalzettoni] = useState("");
  const [kitRighe, setKitRighe] = useState<KitRiga[]>([]);

  const [righe, setRighe] = useState<Riga[]>([]);
  const [saving, setSaving] = useState(false);

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
          .select("id,nome,categoria,costo")
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
      setArticoli((articoliData ?? []) as Articolo[]);
      setKit((kitData ?? []) as Kit[]);
    }

    load();
  }, []);

  useEffect(() => {
    async function loadTaglie() {
      setTaglie([]);
      setTagliaSelezionata("");

      if (!articoloSelezionato) return;

      const { data } = await supabase
        .from("articolo_taglie")
        .select("taglia,giacenza")
        .eq("articolo_id", articoloSelezionato.id)
        .order("taglia");

      setTaglie(
        (data ?? []).map((item) => ({
          taglia: item.taglia,
          giacenza: Number(item.giacenza ?? 0),
        }))
      );
    }

    loadTaglie();
  }, [articoloSelezionato]);

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

  const tesserato = tesserati.find(
    (item) => item.id === tesseratoId
  );

  const tesseratiFiltrati = useMemo(() => {
    const q = cercaTesserato.trim().toLowerCase();

    if (!q) {
      return tesserati.slice(0, 20);
    }

    return tesserati
      .filter((item) =>
        `${item.nome} ${item.cognome}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 20);
  }, [tesserati, cercaTesserato]);

  const articoliPerCategoria = useMemo(() => {
    return CATEGORIE.map((categoria) => ({
      categoria,
      articoli: articoli.filter(
        (item) => item.categoria === categoria
      ),
    }));
  }, [articoli]);

  const totaleArticoli = righe.reduce(
    (sum, riga) =>
      riga.kitId
        ? sum
        : sum + Number(riga.prezzo) * riga.quantita,
    0
  );

  const totaleKit = Array.from(
  new Set(
    righe
      .filter((riga) => riga.kitId)
      .map((riga) => riga.kitId!)
  )
).reduce((sum, kitId) => {
  const kitItem = kit.find(
    (item) => item.id === kitId
  );

  return sum + Number(kitItem?.prezzo ?? 0);
}, 0);

  const totaleOrdine = totaleArticoli + totaleKit;

  function apriArticolo(articolo: Articolo) {
    setArticoloSelezionato(articolo);
    setQuantita(1);
    setTagliaSelezionata("");
    setArticoloOpen(true);
  }

  function chiudiArticolo() {
    setArticoloOpen(false);
    setArticoloSelezionato(null);
    setTagliaSelezionata("");
    setQuantita(1);
  }

  function disponibilitaSelezionata() {
    if (!articoloSelezionato) return 0;

    if (taglie.length > 0) {
      return Number(
        taglie.find(
          (item) => item.taglia === tagliaSelezionata
        )?.giacenza ?? 0
      );
    }

    return 0;
  }

  function aggiungiArticolo() {
    if (!articoloSelezionato) return;

    if (taglie.length > 0 && !tagliaSelezionata) {
      return;
    }

    setRighe((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        articoloId: articoloSelezionato.id,
        nome: articoloSelezionato.nome,
        taglia:
          taglie.length > 0
            ? tagliaSelezionata
            : null,
        quantita,
        prezzo: Number(articoloSelezionato.costo),
      },
    ]);

    chiudiArticolo();
  }

  function apriKit() {
    setKitOpen(true);
    setKitId("");
    setKitRighe([]);
    setTagliaKit("");
    setTagliaCalzettoni("");
  }

  function aggiungiKit() {
    const kitSelezionato = kit.find(
      (item) => item.id === kitId
    );

    if (!kitSelezionato) return;

    const componenti = kitRighe.filter(
      (item) => item.tipo_taglia !== "nessuna"
    );

    const richiedeAbbigliamento = componenti.some(
      (item) => item.tipo_taglia === "abbigliamento"
    );

    const richiedeCalzettoni = componenti.some(
      (item) => item.tipo_taglia === "calzettoni"
    );

    if (richiedeAbbigliamento && !tagliaKit) return;
    if (richiedeCalzettoni && !tagliaCalzettoni) return;

    const nuoveRighe: Riga[] = kitRighe.map((riga) => {
      if (!riga.articoli) {
        throw new Error("Componente kit non trovato.");
      }

      const taglia =
        riga.tipo_taglia === "abbigliamento"
          ? tagliaKit
          : riga.tipo_taglia === "calzettoni"
            ? tagliaCalzettoni
            : null;

      return {
        id: crypto.randomUUID(),
        articoloId: riga.articolo_id,
        nome: riga.articoli.nome,
        taglia,
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

    setKitOpen(false);
    setKitId("");
    setKitRighe([]);
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
          stato: "in_attesa",
          totale: Number(totaleOrdine.toFixed(2)),
        })
        .select("id")
        .single();

      if (error || !ordine) {
        throw new Error(
          error?.message ??
            "Errore nella creazione dell'ordine."
        );
      }

      const righeAggregate = new Map<
    string,
    {
      ordine_id: string;
      articolo_id: string;
      taglia: string | null;
      quantita: number;
      quantita_consegnata: number;
    }
  >();

  for (const riga of righe) {
    const chiave = `${riga.articoloId}:${riga.taglia ?? "Unica"}`;
    const esistente = righeAggregate.get(chiave);

    if (esistente) {
      esistente.quantita += riga.quantita;
    } else {
      righeAggregate.set(chiave, {
        ordine_id: ordine.id,
        articolo_id: riga.articoloId,
        taglia: riga.taglia,
        quantita: riga.quantita,
        quantita_consegnata: 0,
      });
    }
  }

  const righeDaInserire = Array.from(righeAggregate.values());

  const { error: righeError } = await supabase
    .from("ordine_righe")
    .insert(righeDaInserire);

  if (righeError) {
    throw new Error(righeError.message);
  }

  const { data: nuovoStato, error: statoError } =
        await supabase.rpc(
          "ricalcola_stato_ordine",
          {
            p_ordine_id: ordine.id,
          }
        );

      if (statoError || !nuovoStato) {
        throw new Error(
          statoError?.message ??
            "Errore nel calcolo dello stato dell'ordine."
        );
      }

      const { error: statoUpdateError } = await supabase
        .from("ordini")
        .update({
          stato: nuovoStato,
        })
        .eq("id", ordine.id);

      if (statoUpdateError) {
        throw new Error(statoUpdateError.message);
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
            (item) => item.id === riga.kitId
          );

          kitGroups.set(riga.kitId, {
            quantita: 1,
            prezzo: Number(
              selectedKit?.prezzo ?? 0
            ),
          });
        }
      }

      for (const [
        selectedKitId,
        value,
      ] of kitGroups) {
        const { error: kitError } =
          await supabase
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

  return (
    <div className="flex flex-col gap-4 pb-4">
      <button
        type="button"
        onClick={() => setTesseratoOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border-2 bg-card p-4 text-left shadow-sm transition hover:border-[#1668E8]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1668E8]/10">
          <UserRound className="h-5 w-5 text-[#1668E8]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">
            Tesserato
          </p>

          <p className="truncate font-semibold">
            {tesserato
              ? `${tesserato.cognome} ${tesserato.nome}`
              : "Seleziona tesserato"}
          </p>
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {articoliPerCategoria.map(
        ({ categoria, articoli: categoriaArticoli }) => (
          <section key={categoria}>
            <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {categoria}
            </h2>

            <div className="space-y-2">
              {categoriaArticoli.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => apriArticolo(item)}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 bg-card p-4 text-left shadow-sm transition hover:border-[#1668E8]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1668E8]/10">
                    <ShoppingCart className="h-5 w-5 text-[#1668E8]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {item.nome}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      €{Number(item.costo).toFixed(2)}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        )
      )}

      {kit.length > 0 && (
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Kit
          </h2>

          <button
            type="button"
            onClick={apriKit}
            className="flex w-full items-center gap-3 rounded-2xl border-2 bg-card p-4 text-left shadow-sm transition hover:border-[#1668E8]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-600/10">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                Aggiungi Kit
              </p>

              <p className="text-xs text-muted-foreground">
                Kit disponibili
              </p>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </section>
      )}

      {righe.length > 0 && (
        <Card className="rounded-3xl border-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">
              Riepilogo
            </h2>

            <span className="text-sm text-muted-foreground">
              {righe.length} righe
            </span>
          </div>

          <div className="space-y-2">
            {righe.map((riga) => (
              <div
                key={riga.id}
                className="flex items-center gap-3 rounded-2xl border p-3"
              >
                <div className="min-w-0 flex-1">
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

                <div className="shrink-0 text-right">
                  {!riga.kitId && (
                    <p className="font-semibold">
                      €
                      {(
                        Number(riga.prezzo) *
                        riga.quantita
                      ).toFixed(2)}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      rimuoviRiga(riga.id)
                    }
                    className="mt-1 text-xs font-medium text-red-600"
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="font-semibold">
              Totale
            </span>

            <span className="text-2xl font-bold">
              €{totaleOrdine.toFixed(2)}
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
        {saving
          ? "Creazione..."
          : "Crea Ordine"}
      </Button>

      {tesseratoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex h-[540px] max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-background p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Seleziona tesserato
              </h2>

              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() =>
                  setTesseratoOpen(false)
                }
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

              <Input
                autoFocus
                value={cercaTesserato}
                onChange={(e) =>
                  setCercaTesserato(e.target.value)
                }
                placeholder="Cerca nome o cognome..."
                className="h-12 rounded-2xl pl-10"
              />
            </div>

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-2xl border">
              {tesseratiFiltrati.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between border-b p-4 text-left last:border-b-0 hover:bg-muted"
                  onClick={() => {
                    setTesseratoId(item.id);
                    setCercaTesserato("");
                    setTesseratoOpen(false);
                  }}
                >
                  <span className="font-semibold">
                    {item.cognome} {item.nome}
                  </span>

                  {item.id === tesseratoId && (
                    <Check className="h-5 w-5 text-[#1668E8]" />
                  )}
                </button>
              ))}

              {!tesseratiFiltrati.length && (
                <p className="p-5 text-center text-sm text-muted-foreground">
                  Nessun tesserato trovato.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {articoloOpen && articoloSelezionato && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex h-[540px] max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-background p-5 shadow-2xl animate-in zoom-in-95 duration-200">

        <div className="flex h-[65px] shrink-0 items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {articoloSelezionato.categoria}
            </p>

            <h2 className="text-xl font-bold">
              {articoloSelezionato.nome}
            </h2>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={chiudiArticolo}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-4 h-[210px] shrink-0">
          {taglie.length > 0 ? (
            <>
              <p className="mb-2 text-sm font-semibold">
                Taglia
              </p>

              <div className="h-[150px] overflow-y-auto rounded-2xl border border-border/60 p-2">
                <div className="grid grid-cols-4 gap-2">
                  {taglie.map((item) => {
                    const selected =
                      item.taglia === tagliaSelezionata;

                    return (
                      <button
                        key={item.taglia}
                        type="button"
                        disabled={item.giacenza <= 0}
                        onClick={() =>
                          setTagliaSelezionata(item.taglia)
                        }
                        className={`rounded-xl border-2 px-2 py-3 text-sm font-semibold transition ${
                          selected
                            ? "border-[#1668E8] bg-[#1668E8] text-white"
                            : "border-border bg-background"
                        } ${
                          item.giacenza <= 0
                            ? "cursor-not-allowed opacity-35"
                            : "hover:border-[#1668E8]"
                        }`}
                      >
                        {item.taglia}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2 h-5 text-center text-sm text-muted-foreground">
                {tagliaSelezionata
                  ? `${disponibilitaSelezionata()} disponibili`
                  : "Seleziona una taglia"}
              </div>
            </>
          ) : (
            <div className="flex h-[180px] items-center justify-center rounded-2xl bg-muted/40">
              <p className="text-sm text-muted-foreground">
                Taglia unica
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 h-[110px] shrink-0">
          <p className="mb-2 text-sm font-semibold">
            Quantità
          </p>

          <div className="flex h-[88px] items-center justify-center gap-6 rounded-2xl bg-muted p-4">
            <Button
              type="button"
              size="icon"
              className="h-14 w-14 rounded-2xl"
              variant="outline"
              disabled={quantita <= 1}
              onClick={() =>
                setQuantita((value) =>
                  Math.max(1, value - 1)
                )
              }
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
              onClick={() =>
                setQuantita((value) => value + 1)
              }
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="mt-3 shrink-0">
          <Button
            type="button"
            disabled={
              taglie.length > 0 &&
              !tagliaSelezionata
            }
            onClick={aggiungiArticolo}
            className="h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
          >
            Aggiungi
          </Button>
        </div>

      </div>
    </div>
  )}

  {kitOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`flex ${kitId ? "h-[800px]" : "h-[420px]"} max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-background p-5 shadow-2xl animate-in zoom-in-95 duration-200`}>

        {!kitId ? (
          <>
            <div className="flex h-[60px] shrink-0 items-center justify-between">
              <h2 className="text-xl font-bold">
                Scegli Kit
              </h2>

              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => setKitOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pt-3">
              <div className="space-y-2">
                {kit.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setKitId(item.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border-2 border-border p-4 text-left transition hover:border-[#1668E8] hover:bg-[#1668E8]/5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {item.nome}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        €{Number(item.prezzo).toFixed(2)}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[60px] shrink-0 items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Kit
                </p>

                <h2 className="text-xl font-bold">
                  {kit.find((item) => item.id === kitId)?.nome}
                </h2>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => setKitOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pt-5">
              <div className="space-y-5">

                {kitRighe.some(
                  (riga) => riga.tipo_taglia === "abbigliamento"
                ) && (
                  <div>
                    <p className="mb-2 text-sm font-semibold">
                      Taglia abbigliamento
                    </p>

                    <div className="grid grid-cols-4 gap-2">
                      {TAGLIE_ABBIGLIAMENTO.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setTagliaKit(item)}
                          className={`rounded-xl border-2 py-3 text-sm font-semibold transition ${
                            tagliaKit === item
                              ? "border-[#1668E8] bg-[#1668E8] text-white"
                              : "border-border hover:border-[#1668E8]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {kitRighe.some(
                  (riga) => riga.tipo_taglia === "calzettoni"
                ) && (
                  <div>
                    <p className="mb-2 text-sm font-semibold">
                      Taglia calzettoni
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {TAGLIE_CALZETTONI.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setTagliaCalzettoni(item)}
                          className={`rounded-xl border-2 py-3 text-sm font-semibold transition ${
                            tagliaCalzettoni === item
                              ? "border-[#1668E8] bg-[#1668E8] text-white"
                              : "border-border hover:border-[#1668E8]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl bg-muted p-4">
                  <p className="mb-2 text-sm font-semibold">
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

              </div>
            </div>

            <div className="mt-3 shrink-0">
              <Button
                type="button"
                onClick={aggiungiKit}
                className="h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
              >
                Aggiungi Kit
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  )}
    </div>
  );
}
