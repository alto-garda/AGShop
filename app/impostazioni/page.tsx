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
import { Button } from "@/components/ui/button";

const items = [
  {
    href: "/profilo",
    title: "Profilo",
    subtitle: "Nome, email e accesso",
    icon: UserRound,
    primary: true,
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
    <div className="flex flex-col gap-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            {item.primary ? (
              <Button className="h-12 w-full rounded-2xl bg-[#1668E8] font-semibold">
                <Icon className="mr-2 h-5 w-5" />
                Vedi Profilo
              </Button>
            ) : (
              <Card className="rounded-2xl border p-3 shadow-sm transition hover:border-[#1668E8]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1668E8]/10">
                    <Icon className="h-[22px] w-[22px] text-[#1668E8]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                </div>
              </Card>
            )}
          </Link>
        );
      })}
    </div>
  );
}