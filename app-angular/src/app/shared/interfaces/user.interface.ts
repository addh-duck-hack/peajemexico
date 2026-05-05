export interface UserResponse {
  message: string;
  token:   string;
  user:    User;
}

export interface User {
  _id:          string;
  name:         string;
  email:        string;
  role:         string;
  isVerified:   boolean;
  createdAt:    Date;
  __v:          number;
  profileImage: string;
}
