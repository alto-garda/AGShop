"use client";

import { useState } from "react";

import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AssociazionePage() {
  const [nome, setNome] = useState("ASD Alto Garda");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");

  function salva() {
    alert("Funzione disponibile nel prossimo step.");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">

      <Card className="rounded-3xl border-2 p-6">

        <div className="mb-6 flex flex-col items-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1668E8]/10">
            <Building2 className="h-10 w-10 text-[#1668E8]" />
          </div>

          <h1 className="mt-4 text-xl font-bold">
            Associazione
          </h1>

        </div>

        <div className="space-y-4">

          <Input
            placeholder="Nome Associazione"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <Input
            placeholder="Indirizzo"
            value={indirizzo}
            onChange={(e) => setIndirizzo(e.target.value)}
          />

        </div>

      </Card>

      <Button
        className="h-14 rounded-2xl bg-[#1668E8]"
        onClick={salva}
      >
        Salva
      </Button>

    </div>
  );
}
