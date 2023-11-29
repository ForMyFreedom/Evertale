import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import { PaginationData } from "@ioc:forfabledomain";

export function paginate<T>(response: ModelPaginatorContract<any>): PaginationData<T> {
    const meta = response.getMeta()
    return {
        all: response.all(),
        meta: {
            currentPage: meta.current_page,
            firstPage: meta.first_page,
            lastPage: meta.last_page,
            totalItens: meta.total
        }
    }
}