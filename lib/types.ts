export interface Digimon {
  id: number;
  name: string;
  stage: string[];
}

export interface RelationshipEdge {
  from: number;
  to: number;
}

export interface RelationshipNode {
  digimon: Digimon;
  children: RelationshipNode[];
}

export interface RelationshipTree {
  digimon: Digimon;
  ancestors: Digimon[];
  descendants: RelationshipNode[];
}

export interface DigimonsPage {
  items: Digimon[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  query: string;
}
