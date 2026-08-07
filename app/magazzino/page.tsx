import Link from "next/link";
import {
  PackagePlus,
  PackageMinus,
  Boxes,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const items = [
  {
    href: "/magazzino/carico",
    title: "Carico Magazzino",
    subtitle: "Aggiungi giacenze",
    icon: PackagePlus,
  },
  {
    href: "/magazzino/scarico",
    title: "Scarico Magazzino",
    subtitle: "Rimuovi giacenze",
    icon: PackageMinus,
  },
  {
    href: "/articoli",
    title: "Giacenze",
    subtitle: "Visualizza disponibilità",
    icon: Boxes,
  },
];

export default function MagazzinoPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
          >
            <Card className="rounded-2xl border-2 border-slate-200 p-4 shadow-sm transition hover:border-[#1668E8]">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1668E8]/10">
                  <Icon className="h-6 w-6 text-[#1668E8]" />
                </div>

                <div className="flex-1">

                  <h2 className="font-semibold">
                    {item.title}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {item.subtitle}
                  </p>

                </div>

                <ChevronRight className="text-slate-400" />

              </div>

            </Card>
          </Link>
        );
      })}

    </div>
  );
}
