import Link from "next/link";
import {
  UserRound,
  ReceiptText,
  Palette,
  SlidersHorizontal,
  Bell,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const items = [
  {
    href: "/profilo",
    title: "Profilo",
    subtitle: "Nome, email e accesso",
    icon: UserRound,
  },
  {
    href: "/impostazioni/dati-fiscali",
    title: "Dati Fiscali",
    subtitle: "Dati fiscali dell'associazione",
    icon: ReceiptText,
  },
  {
    href: "/impostazioni/tema",
    title: "Tema",
    subtitle: "Aspetto dell'app",
    icon: Palette,
  },
  {
    href: "/impostazioni/applicazione",
    title: "Applicazione",
    subtitle: "Database, privacy e sicurezza",
    icon: SlidersHorizontal,
  },
  {
    href: "/impostazioni/notifiche",
    title: "Notifiche",
    subtitle: "Preferenze",
    icon: Bell,
  },
];

export default function ImpostazioniPage() {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <Card className="rounded-2xl border-2 border-slate-200 p-3.5 shadow-sm transition hover:border-[#1668E8] dark:border-slate-700">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1668E8]/10">
                  <Icon className="h-5 w-5 text-[#1668E8]" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">
                    {item.title}
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />

              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
