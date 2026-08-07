"use client";

import Image from "next/image";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { usePathname } from "next/navigation";

const pages: Record<string, string> = {
  "/": "Dashboard",
  "/articoli": "Articoli",
  "/ordini": "Ordini",
  "/tesserati": "Tesserati",
  "/impostazioni": "Impostazioni",
};

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 rounded-b-3xl bg-[#1668E8] px-5 pt-5 pb-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <Image
          src="/logo.png"
          alt="ASD Alto Garda"
          width={48}
          height={48}
          priority
        />

        <span className="text-sm font-medium">
          {format(new Date(), "dd MMM yyyy", {
            locale: it,
          })}
        </span>
      </div>

      <h1 className="mt-4 text-center text-2xl font-bold">
        {pages[pathname] ?? "AGShop"}
      </h1>
    </header>
  );
}