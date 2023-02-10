declare namespace Express {
  interface CustomSessionFields {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
  type RequestExpress = import("express-serve-static-core").Request;
  type SessionExpress = import("express-session").Session;
  type SessionDataExpress = import("express-session").SessionData;
  export interface Request {
    session: SessionExpress & Partial<SessionDataExpress> & CustomSessionFields;
  }
}
