export enum EndPointsEnum {
  TODOS = 'todos?page=',
  UPLOAD = 'upload/image',
  IMAGES = 'images/',
  LOGIN = 'auth/login',
  LOGOUT = 'auth/logout',
  REGISTER = 'auth/register',
  PROFILE = 'auth/profile',
  REFRESH_TOKEN = 'auth/refresh-token?token=',
  DELETE = 'todos/',
  GET_ONE = 'todos/',
  CREATE = "todos",
  EDIT = 'todos/',

  /* for Local Storage and Filesystem*/
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
  STORED_IMAGES = 'stored_images'
}
