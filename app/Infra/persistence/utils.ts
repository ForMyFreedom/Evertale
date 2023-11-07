import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import { Pagination } from "@ioc:forfabledomain";

export function paginate<T>(response: ModelPaginatorContract<any>): Pagination<T>['data'] {
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