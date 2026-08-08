import Link from "next/link";
import {
  Hand,
  PackagePlus,
  PackageMinus,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const [
    { count: inseriti },
    { count: daConsegnare },
  ] = await Promise.all([
    supabase
      .from("ordini")
      .select("*", { count: "exact", head: true })
      .eq("stato", "inserito"),

    supabase
      .from("ordini")
      .select("*", { count: "exact", head: true })
      .in("stato", ["arrivato", "parziale"]),
  ]);

  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center gap-3">
        <Hand className="h-8 w-8 text-[#1668E8]" />

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Benvenuto Andrea
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            ASD Alto Garda
          </p>
        </div>
      </div>

      <Link href="/ordini/nuovo">
        <Button className="h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold shadow-lg hover:bg-[#0F5BD6]">
          <ShoppingCart className="mr-3 h-5 w-5" />
          Nuovo Ordine
        </Button>
      </Link>

      <div className="grid grid-cols-2 gap-3">

        <Link href="/magazzino/carico">
          <Button
            variant="outline"
            className="h-14 w-full rounded-2xl border-2 border-slate-300 bg-white text-base font-semibold shadow-sm hover:border-[#1668E8] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <PackagePlus className="mr-2 h-5 w-5 text-[#1668E8]" />
            Carico
          </Button>
        </Link>

        <Link href="/magazzino/scarico">
          <Button
            variant="outline"
            className="h-14 w-full rounded-2xl border-2 border-slate-300 bg-white text-base font-semibold shadow-sm hover:border-[#1668E8] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <PackageMinus className="mr-2 h-5 w-5 text-[#1668E8]" />
            Scarico
          </Button>
        </Link>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <Link href="/ordini">
          <Card className="rounded-2xl border-2 border-slate-200 shadow-sm dark:border-slate-700">
            <div className="p-4">

              <div className="flex flex-col items-center gap-1">
                <ShoppingCart className="h-5 w-5 text-[#1668E8]" />

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Inseriti
                </span>
              </div>

              <div className="mt-3 text-center text-3xl font-bold text-slate-900 dark:text-white">
                {inseriti ?? 0}
              </div>

            </div>

            <div className="h-2 rounded-b-2xl bg-[#FFD339]" />
          </Card>
        </Link>

        <Link href="/ordini">
          <Card className="rounded-2xl border-2 border-slate-200 shadow-sm dark:border-slate-700">
            <div className="p-4">

              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-[#1668E8]" />

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Da Consegnare
                </span>
              </div>

              <div className="mt-3 text-center text-3xl font-bold text-slate-900 dark:text-white">
                {daConsegnare ?? 0}
              </div>

            </div>

            <div className="h-2 rounded-b-2xl bg-[#FFD339]" />
          </Card>
        </Link>

      </div>

    </div>
  );
}
