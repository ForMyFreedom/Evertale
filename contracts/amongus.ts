declare module '@ioc:Adonis/Core/HttpContext' {
    interface HttpContextContract {
        usecase: () => number
    }
}
