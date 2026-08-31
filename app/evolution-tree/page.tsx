import Link from "next/link";

export default function EvolutionTreePage() {
  return (
    <div>
      <h1>Evolution Tree</h1>
      <ul>
        <li>
          <Link href="/evolution-tree/create">Create</Link>
        </li>
        <li>
          <Link href="/evolution-tree/view">View</Link>
        </li>
      </ul>
    </div>
  );
}
