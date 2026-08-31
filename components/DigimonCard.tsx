import Link from "next/link";
import type { Digimon } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import DigifarmButton from "./DigifarmButton";

export default function DigimonCard({
  digimon,
  lang,
  digifarmDict,
}: {
  digimon: Digimon;
  lang: Locale;
  digifarmDict: Dictionary["digifarm"];
}) {
  return (
    <article>
      <h3>
        <Link href={`/${lang}/digimons/${digimon.id}`}>{digimon.name}</Link>
      </h3>
      <p>{digimon.stage.join(" / ")}</p>
      <DigifarmButton digimonId={digimon.id} dict={digifarmDict} />
    </article>
  );
}
