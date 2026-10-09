export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  username?: string;
  avatar?: string;
}
