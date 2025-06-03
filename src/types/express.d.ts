export interface AuthenticatedUser {
  userId: string;
  role: string;
}

declare namespace Express {
  export interface Request {
    user?: AuthenticatedUser;
  }
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
