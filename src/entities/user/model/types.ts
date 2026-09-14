export interface User {
  email: string;
}

export interface Session {
  token: string;
  user: User;
  expiresAt: number;
}
