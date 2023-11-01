
declare module '@ioc:Providers/CommentsService' {
  import { CommentsUsecase, LoginUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const CommentProvider: (ctx: HttpContextContract) => CommentsUsecase
  export default CommentProvider
}

declare module '@ioc:Providers/ConstantsService' {
  import { ConstantsUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const ConstantProvider: (ctx: HttpContextContract) => ConstantsUsecase
  export default ConstantProvider
}

declare module '@ioc:Providers/DailyPromptsService' {
  import { DailyPromptsUsecase } from "@ioc:forfabledomain"
  const DailyPromptsProvider: () => DailyPromptsUsecase
  export default DailyPromptsProvider
}

declare module '@ioc:Providers/GenresService' {
  import { GenresUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const GenresProvider: (ctx: HttpContextContract) => GenresUsecase
  export default GenresProvider
}

declare module '@ioc:Providers/MailService' {
  import { MailUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const MailProvider: (ctx: HttpContextContract) => MailUsecase
  export default MailProvider
}

declare module '@ioc:Providers/PromptsService' {
  import { PromptsUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const PromptsProvider: (ctx: HttpContextContract) => PromptsUsecase
  export default PromptsProvider
}

declare module '@ioc:Providers/ProposalsService' {
  import { ProposalsUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const ProposalsProvider: (ctx: HttpContextContract) => ProposalsUsecase
  export default ProposalsProvider
}

declare module '@ioc:Providers/ReactCommentsService' {
  import { ReactCommentsUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const ReactCommentsProvider: (ctx: HttpContextContract) => ReactCommentsUsecase
  export default ReactCommentsProvider
}

declare module '@ioc:Providers/ReactWritesService' {
  import { ReactWritesUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const ReactWritesProvider: (ctx: HttpContextContract) => ReactWritesUsecase
  export default ReactWritesProvider
}

declare module '@ioc:Providers/UsersService' {
  import { UsersUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const UsersProvider: (ctx: HttpContextContract) => UsersUsecase
  export default UsersProvider
}

declare module '@ioc:Providers/StoryAdvanceService' {
  import { StoryAdvanceUsecase } from "@ioc:forfabledomain"
  const StoryAdvanceProvider: () => StoryAdvanceUsecase
  export default StoryAdvanceProvider
}

declare module '@ioc:Providers/LoginService' {
  import { LoginUsecase } from "@ioc:forfabledomain"
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  const LoginProvider: (ctx: HttpContextContract) => LoginUsecase
  export default LoginProvider
}
