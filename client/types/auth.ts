export interface User {
  _id: string;
  name: string;
  email: string;
  role : string;
  image?: string;
  wishlist: string[];
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}