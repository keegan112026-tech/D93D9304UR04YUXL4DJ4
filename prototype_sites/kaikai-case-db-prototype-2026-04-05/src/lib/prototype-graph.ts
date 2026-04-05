import type { Edge, Node } from "reactflow";
import { MarkerType } from "reactflow";

export const graphNodes: Node[] = [
  {
    id: "org-cl",
    position: { x: 40, y: 50 },
    data: { label: "兒福聯盟" },
    style: graphNodeStyle("organization"),
  },
  {
    id: "person-chen",
    position: { x: 290, y: 10 },
    data: { label: "陳尚潔" },
    style: graphNodeStyle("person"),
  },
  {
    id: "event-death",
    position: { x: 280, y: 170 },
    data: { label: "2023 年底就醫死亡" },
    style: graphNodeStyle("event"),
  },
  {
    id: "doc-cy",
    position: { x: 570, y: 40 },
    data: { label: "監察院報告" },
    style: graphNodeStyle("document"),
  },
  {
    id: "session-226",
    position: { x: 560, y: 190 },
    data: { label: "2026-02-26 庭期" },
    style: graphNodeStyle("session"),
  },
];

export const graphEdges: Edge[] = [
  edge("org-cl", "person-chen", "隸屬"),
  edge("person-chen", "event-death", "涉案脈絡"),
  edge("event-death", "doc-cy", "調查追蹤"),
  edge("person-chen", "session-226", "審判進度"),
  edge("doc-cy", "session-226", "法理對照"),
];

function graphNodeStyle(
  kind: "person" | "organization" | "event" | "document" | "session",
) {
  const tones = {
    person: { bg: "#f9f3e4", border: "#d6bc8a", color: "#5b4920" },
    organization: { bg: "#eef1ea", border: "#aab69a", color: "#304136" },
    event: { bg: "#ece8f7", border: "#b5addb", color: "#41386b" },
    document: { bg: "#f5ece8", border: "#d2ad97", color: "#6b4538" },
    session: { bg: "#ebf0f5", border: "#9fb2c3", color: "#334a5f" },
  }[kind];

  return {
    width: 170,
    padding: 14,
    borderRadius: 18,
    border: `1px solid ${tones.border}`,
    background: tones.bg,
    color: tones.color,
    fontSize: 13,
    lineHeight: 1.45,
    boxShadow: "0 16px 42px rgba(20, 18, 14, 0.08)",
  };
}

function edge(source: string, target: string, label: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    label,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#7d6e4f",
    },
    labelStyle: {
      fill: "#665d52",
      fontSize: 11,
      fontWeight: 500,
    },
    style: {
      stroke: "#a69373",
      strokeWidth: 1.4,
    },
  };
}
