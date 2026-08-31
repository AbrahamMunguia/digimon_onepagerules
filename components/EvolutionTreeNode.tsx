"use client";

import {
  childSlot,
  type EvolutionTreeNode as EvolutionTreeNodeData,
  type EvolutionTreeSlot,
} from "@/lib/evolutionTreeCreate";
import StageDigimonPicker from "./StageDigimonPicker";
import type { Digimon } from "@/lib/types";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function EvolutionTreeNode({
  node,
  dict,
  onAddChild,
  onRemove,
}: {
  node: EvolutionTreeNodeData;
  dict: Dictionary["evolutionTreeCreate"];
  onAddChild: (parentId: string, digimon: Digimon, slot: EvolutionTreeSlot) => void;
  onRemove: (id: string) => void;
}) {
  const slot = childSlot(node.stage, node.tier);

  return (
    <li>
      <span>
        {node.digimon.name} ({node.stage}){" "}
        <button type="button" onClick={() => onRemove(node.id)}>
          {dict.removeButton}
        </button>
      </span>

      {node.children.length > 0 ? (
        <ul>
          {node.children.map((child) => (
            <EvolutionTreeNode key={child.id} node={child} dict={dict} onAddChild={onAddChild} onRemove={onRemove} />
          ))}
        </ul>
      ) : null}

      {slot ? (
        <StageDigimonPicker
          stages={slot.stages}
          dict={dict}
          onAdd={(digimon) => onAddChild(node.id, digimon, slot)}
        />
      ) : (
        <p>{dict.armorTerminalNote}</p>
      )}
    </li>
  );
}
