export interface ISortQuery {
  name: string;
  type: "asc" | "desc";
}

export interface IMeta {
  page: number;
  count: number;
  total?: number;
}

export interface ITabelHeader {
  title: string;
  name: string;
}

export type IFilterQuery = Record<string, string | number | boolean | undefined>;
