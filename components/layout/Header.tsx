"use client";

import Image from "next/image";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";

const pages: Record<string, string> = {
  "/": "Dashboard",
  "/articoli": "Articoli",
  "/ordini": "Ordini",
  "/ordini/nuovo": "Nuovo Ordine",
  "/tesserati": "Tesserati",
  "/magazzino": "Magazzino",
  "/magazzino/carico": "Carico",
  "/magazzino/scarico": "Scarico",
  "/impostazioni": "Impostazioni",
  "/profilo": "Profilo",
};

export function Header() {
  const pathname = usePathname();

  const titolo =
    pathname === "/ordini/lets-go"
      ? "Let's Go"
      : pathname.match(/^\/ordini\/[^/]+$/)
        ? "Dettaglio Ordine"
        : pages[pathname] ?? "AGShop";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#1668E8] px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] text-white shadow-sm">
      <div className="relative flex items-center justify-between">

        <Image
          src="/logo.png"
          alt="ASD Alto Garda"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />

        <div className="absolute left-1/2 -translate-x-1/2">
          <Badge className="rounded-full border border-white/30 bg-white px-3 py-1 text-xs font-semibold text-[#1668E8]">
            {titolo}
          </Badge>
        </div>

        <span className="text-xs font-medium">
          {format(new Date(), "dd MMM", {
            locale: it,
          })}
        </span>

      </div>
    </header>
  );
}
