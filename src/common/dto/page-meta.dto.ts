export class PageMetaDto {
  readonly page: number;
  readonly limit: number;
  readonly total_item: number;
  readonly total_page: number;
  readonly has_prev: boolean;
  readonly has_next: boolean;

  constructor({
    page,
    limit,
    total,
  }: {
    page: number;
    limit: number;
    total: number;
  }) {
    this.page = page;
    this.limit = limit;
    this.total_item = total;
    this.total_page = Math.ceil(this.total_item / this.limit);
    this.has_prev = this.page > 1;
    this.has_next = this.page < this.total_page;
  }
}
