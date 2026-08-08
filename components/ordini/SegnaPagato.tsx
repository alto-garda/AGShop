"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";

export function SegnaPagato({
  ordineId,
}: {
  ordineId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  async function segnaPagato() {
    if (saving) return;

    setSaving(true);

    const { error } = await supabase
      .from("ordini")
      .update({
        stato: "pagato",
      })
      .eq("id", ordineId);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    router.refresh();
  }

  return (
    <Button
      onClick={segnaPagato}
      disabled={saving}
      className="h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold hover:bg-[#0F5BD6]"
    >
      <CheckCircle2 className="mr-3 h-5 w-5" />
      {saving ? "Salvataggio..." : "Segna come pagato"}
    </Button>
  );
}
