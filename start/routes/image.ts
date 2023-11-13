import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.post('post-image', 'ImagesController.postImage')
    Route.post('post-image/user', 'ImagesController.updateUserImage')
  }).middleware('auth')
  Route.get('image/*', 'ImagesController.restore')
}
