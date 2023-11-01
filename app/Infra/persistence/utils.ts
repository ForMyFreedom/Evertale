import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import { Pagination } from "@ioc:forfabledomain";

export function paginate<T>(response: ModelPaginatorContract<any>): Pagination<T> {
    const meta = response.getMeta()
    return {
        data: {
            all: response.all(),
            meta: {
                currentPage: meta.current_page,
                firstPage: meta.first_page,
                lastPage: meta.last_page,
                totalItens: meta.total
            }
        }
    }
}