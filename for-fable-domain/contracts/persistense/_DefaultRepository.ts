
export interface DefaultRepository<TInsert, TEntity extends { id: number }> {
    find(entityId: TEntity['id']): Promise<TEntity|null>
    findAll(): Promise<TEntity[]>
    create(body: TInsert): Promise<TEntity>
    delete(entityId: TEntity['id']): Promise<TEntity|null>
    update(entityId: TEntity['id'], partialBody: Partial<TEntity>): Promise<TEntity|null>
}
