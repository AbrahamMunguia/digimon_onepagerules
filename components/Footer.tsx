import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <footer>
      <p>{dict.disclaimer}</p>
    </footer>
  );
}
