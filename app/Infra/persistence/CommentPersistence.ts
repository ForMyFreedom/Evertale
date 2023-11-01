import { CommentEntity, CommentInsert, CommentRepository, Pagination, UserEntity } from "@ioc:forfabledomain";
import Comment from "App/Models/Comment";
import User from "App/Models/User";
import { paginate } from "./utils";


export class CommentPersistence implements CommentRepository {
  public static instance = new CommentPersistence()

  async find(commentId: number): Promise<CommentEntity | null> {
    return Comment.find(commentId)
  }

  async findAll(page?: number, limit?: number): Promise<Pagination<CommentEntity>> {
    return paginate(await Comment.query().paginate(page || 1, limit))
  }

  async create(body: CommentInsert): Promise<CommentEntity> {
    const comment = await Comment.create(body)
    await comment.load('author')
    return comment
  }

  async delete(commentId: number): Promise<CommentEntity|null> {
    const comment = await Comment.find(commentId)
    if (comment) {
      await comment.delete()
      return comment
    } else {
      return null
    }
  }

  async update(commentId: number, partialBody: Partial<CommentEntity>): Promise<CommentEntity|null> {
    const comment = await Comment.find(commentId)
    if (comment) {
      comment.merge(partialBody)
      await comment.save()
      return comment
    } else {
      return null
    }
  }

  async getByWrite(writeId: number): Promise<CommentEntity[]> {
    const commentsArray = await Comment.query().where('writeId', '=', writeId)
    return commentsArray
  }

  async loadAuthors(commentsArray: CommentEntity[]): Promise<UserEntity[]> {
    const usersArray: User[] = []
    for (const comment of commentsArray) {
      const couldFind = usersArray.find((user) => user.id === comment.authorId)
      if (!couldFind) {
        const user = await User.find(comment.authorId)
        if (user) {
          usersArray.push(user)
        }
      }
    }
    return usersArray
  }
}
