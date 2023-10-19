import { CommentsService, ConstantsService, DailyPromptsService, GenresService, MailService, PromptsService, ProposalsService, ReactCommentsService, ReactWritesService, StoryAdvanceService, UsersService } from "@ioc:forfabledomain"
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LoginService } from "for-fable-domain/services/LoginService"

export default Services

export type ServiceHandler<T> = () => (handler?: HttpContextContract) => T

interface Services {
  CommentsService: ServiceHandler<CommentsService>
  ConstantsService: ServiceHandler<ConstantsService>
  DailyPromptsService: ServiceHandler<DailyPromptsService>
  GenresService: ServiceHandler<GenresService>
  MailService: ServiceHandler<MailService>
  PromptsService: ServiceHandler<PromptsService>
  ProposalsService: ServiceHandler<ProposalsService>
  ReactCommentsService: ServiceHandler<ReactCommentsService>
  ReactWritesService: ServiceHandler<ReactWritesService>
  UsersService: ServiceHandler<UsersService>
  StoryAdvanceService: ServiceHandler<StoryAdvanceService>
  LoginService: ServiceHandler<LoginService>
}