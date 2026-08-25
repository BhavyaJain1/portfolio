"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens the browser print dialog — "Save as PDF" from there. */
export function PrintButton() {
  return (
    <Button onClick={() => window.print()} size="lg">
      <Printer className="size-4" />
      Download / Print PDF
    </Button>
  );
}
