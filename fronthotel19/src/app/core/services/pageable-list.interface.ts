export interface PageableList<T> {
  meta: { total_count: number };
  items: Array<T>;
}

export interface PageableTokenList<T> {
  page_token: string;
  items: Array<T>;
}
