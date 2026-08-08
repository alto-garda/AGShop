"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import {
  House,
  Shirt,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

const items = [
  { href: "/", icon: House, label: "Home" },
  { href: "/articoli", icon: Shirt, label: "Articoli" },
  { href: "/ordini", icon: ClipboardList, label: "Ordini" },
  { href: "/tesserati", icon: Users, label: "Tesserati" },
  { href: "/impostazioni", icon: Settings, label: "Impostazioni" },
];

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-background/95 backdrop-blur-md transition-colors duration-300 dark:border-white/10">
      <nav className="mx-auto flex h-[68px] w-full max-w-md items-stretch px-1">

        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-0 flex-1 items-center justify-center"
            >
              <motion.div
                whileTap={{ scale: 0.92 }}
                className={`flex h-full w-full flex-col items-center justify-center gap-1 ${
                  active
                    ? "text-[#1668E8]"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <div
                  className={`h-1 rounded-full bg-[#FFD339] transition-all duration-200 ${
                    active ? "w-8" : "w-0"
                  }`}
                />

                <Icon size={21} />

                <span className="truncate text-[10px] font-medium">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}

      </nav>
    </footer>
  );
}
