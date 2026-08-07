"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TemaPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">

      <Card className="rounded-3xl border-2 p-6">

        <h1 className="mb-6 text-center text-2xl font-bold">
          Aspetto
        </h1>

        <div className="space-y-3">

          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="h-14 w-full justify-start rounded-2xl"
            onClick={() => setTheme("light")}
          >
            <Sun className="mr-3 h-5 w-5" />
            Chiaro
          </Button>

          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="h-14 w-full justify-start rounded-2xl"
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-3 h-5 w-5" />
            Scuro
          </Button>

          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="h-14 w-full justify-start rounded-2xl"
            onClick={() => setTheme("system")}
          >
            <Monitor className="mr-3 h-5 w-5" />
            Sistema
          </Button>

        </div>

      </Card>

    </div>
  );
}
