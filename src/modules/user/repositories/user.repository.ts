import { createUserInputType, userOutputType } from "../user.schema";

export interface UserRepository {
  create: (user: createUserInputType) => Promise<userOutputType>;
  findById: (id: number) => Promise<userOutputType | null>;
  findByEmail: (email: string) => Promise<userOutputType | null>;
}
