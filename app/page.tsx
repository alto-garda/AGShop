import { supabase } from "@/lib/supabase";

import {
  Hand,
  PackagePlus,
  PackageMinus,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const [{ count: ordini }, { count: consegne }] = await Promise.all([
    supabase
      .from("ordini")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("ordini")
      .select("*", {
        count: "exact",
        head: true,
      })
      .neq("stato", "consegnato"),
  ]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">

      <div className="flex items-center gap-3">
        <Hand className="h-8 w-8 text-[#1668E8]" />

        <div>
          <h2 className="text-2xl font-bold">
            Benvenuto Andrea
          </h2>

          <p className="text-sm text-slate-500">
            ASD Alto Garda
          </p>
        </div>
      </div>

      <Button className="h-14 justify-start rounded-2xl bg-[#1668E8] px-5">
        <ShoppingCart className="mr-3 h-5 w-5" />
        Nuovo Ordine
      </Button>

      <Button
        variant="outline"
        className="h-14 justify-start rounded-2xl border-2"
      >
        <PackagePlus className="mr-3 h-5 w-5 text-[#1668E8]" />
        Carico Magazzino
      </Button>

      <Button
        variant="outline"
        className="h-14 justify-start rounded-2xl border-2"
      >
        <PackageMinus className="mr-3 h-5 w-5 text-[#1668E8]" />
        Scarico Magazzino
      </Button>

      <div className="grid grid-cols-2 gap-4">

        <Card className="overflow-hidden rounded-2xl border-2">

          <div className="flex flex-col items-center p-5">

            <ShoppingCart className="h-7 w-7 text-[#1668E8]" />

            <span className="mt-3 text-center font-semibold">
              Ordini Inseriti
            </span>

            <span className="mt-4 text-4xl font-bold">
              {ordini ?? 0}
            </span>

          </div>

          <div className="h-2 bg-[#FFD339]" />

        </Card>

        <Card className="overflow-hidden rounded-2xl border-2">

          <div className="flex flex-col items-center p-5">

            <Truck className="h-7 w-7 text-[#1668E8]" />

            <span className="mt-3 text-center font-semibold">
              Da Consegnare
            </span>

            <span className="mt-4 text-4xl font-bold">
              {consegne ?? 0}
            </span>

          </div>

          <div className="h-2 bg-[#FFD339]" />

        </Card>

      </div>

    </div>
  );
}
