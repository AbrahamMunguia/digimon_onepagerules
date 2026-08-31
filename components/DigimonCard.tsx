import Link from "next/link";
import type { Digimon } from "@/lib/types";
import DigifarmButton from "./DigifarmButton";

export default function DigimonCard({ digimon }: { digimon: Digimon }) {
  return (
    <article>
      <h3>
        <Link href={`/digimons/${digimon.id}`}>{digimon.name}</Link>
      </h3>
      <p>{digimon.stage.join(" / ")}</p>
      <DigifarmButton digimonId={digimon.id} />
    </article>
  );
}
