"use client";

import { useDigifarm } from "@/lib/digifarm-context";

export default function DigifarmCount() {
  const { ids } = useDigifarm();
  return <span>({ids.length})</span>;
}
