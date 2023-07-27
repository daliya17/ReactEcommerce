export type paginatedResponse = {
    data: [],
    currentPage: number | null,
    nextPage: number | null,
    totalElements: number | null
}

export type ComparatorConfigResponse = {
    id: string,
    name: string,
    location: string
}