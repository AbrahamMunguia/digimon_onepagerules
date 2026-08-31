export interface Product {
  id: number;
  name: string;
  stage: string[];
}

export interface RelationshipEdge {
  from: number;
  to: number;
}

export interface RelationshipNode {
  product: Product;
  children: RelationshipNode[];
}

export interface RelationshipTree {
  product: Product;
  ancestors: Product[];
  descendants: RelationshipNode[];
}

export interface ProductsPage {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  query: string;
}
