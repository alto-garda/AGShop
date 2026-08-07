"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
};

export function DeleteTesseratoButton({ id }: Props) {
  const router = useRouter();

  async function elimina() {
    const ok = confirm(
      "Eliminare definitivamente il tesserato?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("tesserati")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/tesserati");
    router.refresh();
  }

  return (
    <Button
      variant="destructive"
      className="h-14 justify-start rounded-2xl"
      onClick={elimina}
    >
      <Trash2 className="mr-3 h-5 w-5" />
      Elimina Tesserato
    </Button>
  );
}
