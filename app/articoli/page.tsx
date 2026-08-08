import Link from "next/link";
import {
  Backpack,
  Beer,
  BriefcaseBusiness,
  Footprints,
  GlassWater,
  Hat,
  Plus,
  Shirt,
  ShoppingBag,
  Snowflake,
  Trophy,
  Umbrella,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const categorie = [
  {
    nome: "Rappresentanza",
    colore: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    nome: "Allenamento",
    colore: "text-slate-950 dark:text-white",
    bg: "bg-slate-950/10 dark:bg-white/10",
  },
  {
    nome: "Merchandising",
    colore: "text-red-600",
    bg: "bg-red-600/10",
  },
];

function getIcon(nome: string) {
  const n = nome.toLowerCase();

  if (n.includes("calzett")) return Footprints;
  if (n.includes("borraccia")) return GlassWater;
  if (n.includes("zainett")) return Backpack;
  if (n.includes("borsone")) return ShoppingBag;
  if (n.includes("sacchetta")) return ShoppingBag;
  if (n.includes("cappell")) return Hat;
  if (n.includes("berretta")) return Hat;
  if (n.includes("scaldacollo")) return Snowflake;
  if (n.includes("k-way")) return Umbrella;
  if (n.includes("pantalone")) return BriefcaseBusiness;
  if (n.includes("bermuda")) return BriefcaseBusiness;
  if (n.includes("giaccone")) return Shirt;
  if (n.includes("bomber")) return Shirt;
  if (n.includes("felpa")) return Shirt;
  if (n.includes("maglia")) return Shirt;
  if (n.includes("polo")) return Shirt;

  return Shirt;
}

export default async function ArticoliPage() {
  const { data: articoli, error } = await supabase
    .from("articoli")
    .select("id, categoria, nome, costo, giacenza, attivo")
    .eq("attivo", true)
    .order("nome");

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Card className="rounded-3xl border-2 p-6 text-center">
          <p className="font-semibold">
            Errore nel caricamento degli articoli
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error.message}
          </p>
        </Card>
      </div>
    );
  }

  const gruppi = categorie.map((categoria) => ({
    ...categoria,
    articoli:
      articoli?.filter(
        (articolo) => articolo.categoria === categoria.nome
      ) ?? [],
  }));

  return (
    <div className="flex flex-col gap-5">

      <Link href="/articoli/nuovo">
        <Button className="h-12 w-full rounded-2xl bg-[#1668E8] font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Nuovo Articolo
        </Button>
      </Link>

      {gruppi.map((gruppo) => (
        <section key={gruppo.nome}>

          <div className="mb-2 flex items-center gap-2 px-1">
            <div
              className={`h-2.5 w-2.5 rounded-full ${gruppo.bg}`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${gruppo.colore}`}
              />
            </div>

            <h2 className={`text-sm font-bold uppercase tracking-wide ${gruppo.colore}`}>
              {gruppo.nome}
            </h2>

            <span className="text-xs text-muted-foreground">
              {gruppo.articoli.length}
            </span>
          </div>

          <div className="space-y-2">

            {gruppo.articoli.map((articolo) => {
              const Icon = getIcon(articolo.nome);

              return (
                <Link
                  key={articolo.id}
                  href={`/articoli/${articolo.id}`}
                >
                  <Card className="rounded-2xl border p-3 shadow-sm transition hover:border-[#1668E8]">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${gruppo.bg}`}
                      >
                        <Icon
                          className={`h-5 w-5 ${gruppo.colore}`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate font-semibold">
                          {articolo.nome}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {articolo.giacenza} disponibili
                        </p>

                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-bold">
                          €{Number(articolo.costo).toFixed(2)}
                        </p>
                      </div>

                    </div>

                  </Card>
                </Link>
              );
            })}

            {gruppo.articoli.length === 0 && (
              <Card className="rounded-2xl border-2 border-dashed p-5 text-center text-sm text-muted-foreground">
                Nessun articolo
              </Card>
            )}

          </div>

        </section>
      ))}

    </div>
  );
}
