"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";

const pages: Record<string, string> = {
  "/": "Dashboard",
  "/articoli": "Articoli",
  "/ordini": "Ordini",
  "/tesserati": "Tesserati",
  "/magazzino": "Magazzino",
  "/impostazioni": "Impostazioni",
  "/profilo": "Profilo",
};

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 rounded-b-3xl bg-[#1668E8] px-5 pt-5 pb-4 text-white shadow-lg">

      <div className="flex items-center justify-between">

        <Link href="/">
          <Image
            src="/logo.png"
            alt="ASD Alto Garda"
            width={48}
            height={48}
            priority
          />
        </Link>

        <div className="flex items-center gap-4">

          <span className="text-sm font-medium">
            {format(new Date(), "dd MMM yyyy", {
              locale: it,
            })}
          </span>

          <Link href="/profilo">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30">
              <UserRound className="h-5 w-5" />
            </div>
          </Link>

        </div>

      </div>

      <h1 className="mt-4 text-center text-2xl font-bold">
        {pages[pathname] ?? "AGShop"}
      </h1>

    </header>
  );
}
