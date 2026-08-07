"use client";

import { useState } from "react";
import {
  Bell,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotifichePage() {
  const [ordini] = useState(true);
  const [consegne] = useState(true);
  const [magazzino] = useState(false);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Card className="rounded-3xl border-2 p-6">

        <div className="flex items-center gap-4">
          <Bell className="h-8 w-8 text-[#1668E8]" />

          <div>
            <h1 className="text-2xl font-bold">
              Notifiche
            </h1>

            <p className="text-sm text-slate-500">
              Preferenze applicazione
            </p>
          </div>
        </div>

      </Card>

      <Card className="rounded-2xl border-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-[#1668E8]" />
            <span>Nuovi Ordini</span>
          </div>

          <span>{ordini ? "ON" : "OFF"}</span>
        </div>
      </Card>

      <Card className="rounded-2xl border-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="text-[#1668E8]" />
            <span>Ordini Consegnati</span>
          </div>

          <span>{consegne ? "ON" : "OFF"}</span>
        </div>
      </Card>

      <Card className="rounded-2xl border-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="text-[#1668E8]" />
            <span>Magazzino</span>
          </div>

          <span>{magazzino ? "ON" : "OFF"}</span>
        </div>
      </Card>

      <Button className="h-14 rounded-2xl bg-[#1668E8]">
        Salva Preferenze
      </Button>

    </div>
  );
}
