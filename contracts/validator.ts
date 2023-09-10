declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
      negative(): Rule
      percentage(): Rule
    }
}