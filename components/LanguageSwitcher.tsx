"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const locales = ["es", "en"] as const;

export default function LanguageSwitcher({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary["languageSwitcher"];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLang = event.target.value;
    const segments = pathname.split("/");
    segments[1] = nextLang;
    router.push(segments.join("/") || `/${nextLang}`);
  };

  return (
    <label>
      {dict.label}{" "}
      <select value={lang} onChange={handleChange} aria-label={dict.label}>
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {dict[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
