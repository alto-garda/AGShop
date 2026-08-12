import Link from "next/link";
import {
  Hand,
  PackagePlus,
  PackageMinus,
  ShoppingCart,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase-server";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nome = "Andrea";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nome")
      .eq("id", user.id)
      .single();

    nome = profile?.nome ?? user.user_metadata?.nome ?? "Utente";
  }

  const [
    { count: inAttesa },
    { count: parziali },
    { count: pronti },
    { count: daPagare },
  ] = await Promise.all([
    supabase
      .from("ordini")
      .select("*", { count: "exact", head: true })
      .eq("stato", "in_attesa")
      .is("metodo_pagamento", null),

    supabase
      .from("ordini")
      .select("*", { count: "exact", head: true })
      .eq("stato", "parziale")
      .is("metodo_pagamento", null),

    supabase
      .from("ordini")
      .select("*", { count: "exact", head: true })
      .eq("stato", "pronto")
      .is("metodo_pagamento", null),

    supabase
      .from("ordini")
      .select("*", { count: "exact", head: true })
      .eq("stato", "pronto")
      .is("metodo_pagamento", null),
  ]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">

      <div className="flex shrink-0 items-center gap-3">
        <Hand className="h-8 w-8 text-[#1668E8]" />

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Benvenuto {nome}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestione Magazzino Alto Garda
          </p>
        </div>
      </div>

      <Link href="/ordini/nuovo" className="shrink-0">
        <Button className="h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold text-white shadow-lg hover:bg-[#0F5BD6]">
          <ShoppingCart className="mr-3 h-5 w-5 text-white" />
          Nuovo Ordine
        </Button>
      </Link>

      <div className="flex shrink-0 flex-col gap-3">

        <Link href="/magazzino/carico">
          <Button
            variant="outline"
            className="h-14 w-full rounded-2xl border-2 border-slate-300 bg-white text-base font-semibold shadow-sm hover:border-[#1668E8] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <PackagePlus className="mr-3 h-5 w-5 text-[#1668E8]" />
            Carico Magazzino
          </Button>
        </Link>

        <Link href="/magazzino/scarico">
          <Button
            variant="outline"
            className="h-14 w-full rounded-2xl border-2 border-slate-300 bg-white text-base font-semibold shadow-sm hover:border-[#1668E8] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <PackageMinus className="mr-3 h-5 w-5 text-[#1668E8]" />
            Scarico Magazzino
          </Button>
        </Link>

      </div>

      <Link href="/ordini/lets-go" className="shrink-0">
        <Button className="h-14 w-full rounded-2xl bg-red-600 text-base font-semibold text-white shadow-lg hover:bg-red-700">
          <ShoppingCart className="mr-3 h-5 w-5 text-white" />
          Ordine Let's Go
        </Button>
      </Link>

      <div className="grid shrink-0 grid-cols-2 gap-2">

        <Link href="/ordini?stato=in_attesa">
          <Card className="rounded-2xl border-2 border-slate-200 shadow-sm dark:border-slate-700">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  In Attesa
                </span>
              </div>

              <div className="mt-1 text-2xl font-bold">
                {inAttesa ?? 0}
              </div>
            </div>

            <div className="h-1 rounded-b-2xl bg-red-600" />
          </Card>
        </Link>

        <Link href="/ordini?stato=consegnato">
          <Card className="rounded-2xl border-2 border-slate-200 shadow-sm dark:border-slate-700">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Da Pagare
                </span>
              </div>

              <div className="mt-1 text-2xl font-bold">
                {daPagare ?? 0}
              </div>
            </div>

            <div className="h-1 rounded-b-2xl bg-blue-600" />
          </Card>
        </Link>

        <Link href="/ordini?stato=parziale">
          <Card className="rounded-2xl border-2 border-slate-200 shadow-sm dark:border-slate-700">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Parziali
                </span>
              </div>

              <div className="mt-1 text-2xl font-bold">
                {parziali ?? 0}
              </div>
            </div>

            <div className="h-1 rounded-b-2xl bg-orange-500" />
          </Card>
        </Link>

        <Link href="/ordini?stato=pronto">
          <Card className="rounded-2xl border-2 border-slate-200 shadow-sm dark:border-slate-700">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Pronti
                </span>
              </div>

              <div className="mt-1 text-2xl font-bold">
                {pronti ?? 0}
              </div>
            </div>

            <div className="h-1 rounded-b-2xl bg-green-500" />
          </Card>
        </Link>

      </div>

    </div>
  );
}
