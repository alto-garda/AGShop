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
  "/tesserati": "Tesserati",
  "/magazzino": "Magazzino",
"/magazzino/carico": "Carico",
"/magazzino/scarico": "Scarico",
  "/impostazioni": "Impostazioni",
  "/profilo": "Profilo",
};

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#1668E8] px-4 py-2 text-white shadow-sm">
      <div className="relative flex h-10 items-center justify-between">
        <Image
          src="/logo.png"
          alt="ASD Alto Garda"
          width={36}
          height={36}
          priority
          className="h-9 w-9 object-contain"
        />

        <div className="absolute left-1/2 -translate-x-1/2">
          <Badge className="rounded-full border border-white/30 bg-white px-3 py-1 text-xs font-semibold text-[#1668E8]">
            {pages[pathname] ?? "AGShop"}
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
