import { CommentEntity, CommentInsert, CommentRepository, UserEntity } from "@ioc:forfabledomain";
import Comment from "App/Models/Comment";
import User from "App/Models/User";


export class CommentPersistence implements CommentRepository {
  public static instance = new CommentPersistence()

  async find(commentId: number): Promise<CommentEntity | null> {
    return Comment.find(commentId)
  }

  async findAll(): Promise<CommentEntity[]> {
    return Comment.all()
  }

  async create(body: CommentInsert): Promise<CommentEntity> {
    return Comment.create(body)
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
    for (const comment of commentsArray) {
      delete comment.$attributes.answerToId
      delete comment.$attributes.writeId
    }
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
