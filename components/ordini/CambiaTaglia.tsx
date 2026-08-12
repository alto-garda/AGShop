"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";

import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";

type Props = {
  ordineId: string;
  rigaId: string;
  articoloId: string;
  taglia: string | null;
  quantitaConsegnata: number;
  taglie: {
    taglia: string;
    giacenza: number;
  }[];
  disabilitato?: boolean;
};

export function CambiaTaglia({
  ordineId,
  rigaId,
  articoloId,
  taglia,
  quantitaConsegnata,
  taglie,
  disabilitato = false,
}: Props) {
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(taglia);

  const apri = () => {
    if (disabilitato || quantitaConsegnata > 0) return;

    setSelected(taglia);
    setOpen(true);
  };

  async function salva() {
    if (!selected || selected === taglia || saving) {
      setOpen(false);
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.rpc(
        "cambia_taglia_riga_ordine",
        {
          p_riga_id: rigaId,
          p_nuova_taglia: selected,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      setOpen(false);
      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Errore durante il cambio taglia."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={apri}
        disabled={disabilitato || quantitaConsegnata > 0}
        className={`flex min-h-[40px] w-full items-center justify-center rounded-xl px-2 text-base font-bold transition ${
          disabilitato || quantitaConsegnata > 0
            ? "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800"
            : "bg-black text-white active:scale-95"
        }`}
      >
        {taglia ?? "—"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !saving && setOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-background p-5 shadow-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Cambia taglia
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Taglia attuale:{" "}
                    <span className="font-semibold text-foreground">
                      {taglia ?? "—"}
                    </span>
                  </p>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  disabled={saving}
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {taglie.map((item) => {
                  const selectedItem =
                    selected === item.taglia;

                  const disponibile =
                    item.giacenza > 0 ||
                    item.taglia === taglia;

                  return (
                    <button
                      key={item.taglia}
                      type="button"
                      disabled={!disponibile || saving}
                      onClick={() => setSelected(item.taglia)}
                      className={`relative rounded-xl border-2 py-4 text-sm font-bold transition ${
                        selectedItem
                          ? "border-[#1668E8] bg-[#1668E8] text-white"
                          : disponibile
                            ? "border-border bg-background hover:border-[#1668E8]"
                            : "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-40"
                      }`}
                    >
                      {item.taglia}

                      {selectedItem && (
                        <Check className="absolute right-1.5 top-1.5 h-4 w-4" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Le taglie senza disponibilità non sono selezionabili.
              </p>

              <Button
                type="button"
                disabled={
                  saving ||
                  !selected ||
                  selected === taglia
                }
                onClick={salva}
                className="mt-5 h-14 w-full rounded-2xl bg-[#1668E8] text-base font-semibold"
              >
                {saving ? "Aggiornamento..." : "Conferma taglia"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
