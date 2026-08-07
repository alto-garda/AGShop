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
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-2xl">
      <nav className="mx-auto flex h-20 max-w-md items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center gap-1 ${
                  active ? "text-[#1668E8]" : "text-slate-400"
                }`}
              >
                {active && (
                  <div className="h-1 w-8 rounded-full bg-[#FFD339]" />
                )}

                <Icon size={22} />

                <span className="text-[11px] font-medium">
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