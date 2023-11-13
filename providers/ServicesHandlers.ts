import { CommentsService, ConstantsService, DailyPromptsService, ResponseHandler, GenresService, LoginService, MailService, PromptsService, ProposalsService, ReactCommentsService, ReactWritesService, StoryAdvanceService, UsersService, ImageService } from '@ioc:forfabledomain';
import { AdonisEventEmmiter, AdonisMailSender, CommentPersistence, ConstantsPersistence, GenrePersistence, PromptPersistence, ProposalPersistence, ThematicWordPersistence, WritePersistence } from 'App/Infra';
import { ReactCommentPersistence } from 'App/Infra/persistence/ReactCommentPersistence';
import { ReactWritePersistence } from 'App/Infra/persistence/ReactWritePersistence';
import { TokenPersistence } from 'App/Infra/persistence/TokenPersistence';
import { AdonisAuthWrapper, UserPersistence } from 'App/Infra/persistence/UserPersistence';
import Services, { ServiceHandler } from 'Config/services';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdonisResponseHandler from 'App/Exceptions/Handler';
import { AdonisImageWrapper } from 'App/Infra/persistence/ImagePersistence';

export class ServicesHandlers implements Services {
  allHandlers: {[key in keyof Services]: ServiceHandler<any>} = {
    CommentsService: this.CommentsService.bind(this),
    ConstantsService: this.ConstantsService.bind(this),
    DailyPromptsService: this.DailyPromptsService.bind(this),
    GenresService: this.GenresService.bind(this),
    MailService: this.MailService.bind(this),
    PromptsService: this.PromptsService.bind(this),
    ProposalsService: this.ProposalsService.bind(this),
    ReactCommentsService: this.ReactCommentsService.bind(this),
    ReactWritesService: this.ReactWritesService.bind(this),
    UsersService: this.UsersService.bind(this),
    StoryAdvanceService: this.StoryAdvanceService.bind(this),
    LoginService: this.LoginService.bind(this),
    ImageService: this.ImageService.bind(this),
  }

  CommentsService(): (ctx: HttpContextContract) => CommentsService {
    return (ctx: HttpContextContract) => {
      return new CommentsService(
        CommentPersistence.instance, WritePersistence.instance, Handler(ctx)
      );
    }
  }

  ConstantsService(): (ctx: HttpContextContract) => ConstantsService {
    return (ctx: HttpContextContract) => {
      return new ConstantsService(
        ConstantsPersistence.instance, Handler(ctx)
      )
    }
  }

  DailyPromptsService(): (ctx: HttpContextContract) => DailyPromptsService {
    return (_ctx: HttpContextContract) => {
      return new DailyPromptsService(
        PromptPersistence.instance, WritePersistence.instance, 
        GenrePersistence.instance
      );
    }
  }

  GenresService(): (ctx: HttpContextContract) => GenresService {
    return (ctx: HttpContextContract) => {
      return new GenresService(
        GenrePersistence.instance, ThematicWordPersistence.instance, Handler(ctx)
      );
    }
  }

  MailService(): (ctx: HttpContextContract) => MailService {
    return (ctx: HttpContextContract) => {
      return new MailService(
        AdonisMailSender.instance, TokenPersistence.instance, Handler(ctx)
      );
    }
  }

  PromptsService(): (ctx: HttpContextContract) => PromptsService {
    return (ctx: HttpContextContract) => {
      return new PromptsService(
        PromptPersistence.instance, WritePersistence.instance,
        AdonisEventEmmiter.instance, Handler(ctx)
      );
    }
  }

  ProposalsService(): (ctx: HttpContextContract) => ProposalsService {
    return (ctx: HttpContextContract) => {
      return new ProposalsService(
        ProposalPersistence.instance, PromptPersistence.instance,
        WritePersistence.instance, Handler(ctx)
      );
    }
  }

  ReactCommentsService(): (ctx: HttpContextContract) => ReactCommentsService {
    return (ctx: HttpContextContract) => {
      return new ReactCommentsService(
        ReactCommentPersistence.instance, CommentPersistence.instance, Handler(ctx)
      );
    }
  }

  ReactWritesService(): (ctx: HttpContextContract) => ReactWritesService {
    return (ctx: HttpContextContract) => {
      return new ReactWritesService(
        ReactWritePersistence.instance, WritePersistence.instance,
        ProposalPersistence.instance, PromptPersistence.instance,
        Handler(ctx)
      );
    }
  }

  UsersService(): (ctx: HttpContextContract) => UsersService {
    return (ctx: HttpContextContract) => {
      return new UsersService(
        UserPersistence.instance, TokenPersistence.instance,
        this.MailService()(ctx), Handler(ctx)
      );
    }
  }
  
  StoryAdvanceService(): (ctx: HttpContextContract) => StoryAdvanceService {
    return (_ctx: HttpContextContract) => {
      return new StoryAdvanceService(
        PromptPersistence.instance, ProposalPersistence.instance,
        ConstantsPersistence.instance
      );
    }
  }

  LoginService(): (ctx: HttpContextContract) => LoginService {
    return (ctx: HttpContextContract) => {
      const authWraper = new AdonisAuthWrapper(ctx.auth)
      return new LoginService(
        authWraper, UserPersistence.instance, Handler(ctx)
      );
    }
  }

  ImageService(): (ctx: HttpContextContract) => ImageService {
    return (ctx: HttpContextContract) => {
      const imageWrapper = new AdonisImageWrapper(ctx)
      return new ImageService(
        imageWrapper, ConstantsPersistence.instance,
        UserPersistence.instance, Handler(ctx)
      )
    }
  }
}

function Handler(ctx: HttpContextContract): ResponseHandler {
  return AdonisResponseHandler.getInstance(ctx.response)    
}

export default ServicesHandlers
