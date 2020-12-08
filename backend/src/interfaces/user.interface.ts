export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserAuthResponse {
  email: string;
  firstName: string;
  lastName: string;
  cookie: string;
}