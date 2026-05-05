export function parsePositivePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const currentPage = Math.min(page, totalPages);

  return {
    items: items.slice((currentPage - 1) * limit, currentPage * limit),
    pagination: {
      page: currentPage,
      limit,
      totalPages,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
    },
  };
}
