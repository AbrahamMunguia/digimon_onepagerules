"use client";

import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import type { EvolutionGraph } from "@/lib/types";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 40;

function layout(graph: EvolutionGraph): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR" });

  for (const digimon of graph.nodes) {
    dagreGraph.setNode(String(digimon.id), { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of graph.edges) {
    dagreGraph.setEdge(String(edge.from), String(edge.to));
  }

  dagre.layout(dagreGraph);

  const nodes: Node[] = graph.nodes.map((digimon) => {
    const { x, y } = dagreGraph.node(String(digimon.id));
    return {
      id: String(digimon.id),
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
      data: { label: `${digimon.name} (${digimon.stage.join(", ")})` },
      style: { width: NODE_WIDTH },
    };
  });

  const edges: Edge[] = graph.edges.map((edge) => ({
    id: `${edge.from}-${edge.to}`,
    source: String(edge.from),
    target: String(edge.to),
  }));

  return { nodes, edges };
}

export default function EvolutionTreeDiagram({ graph }: { graph: EvolutionGraph }) {
  const { nodes, edges } = layout(graph);

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
