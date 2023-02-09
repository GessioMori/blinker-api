import { CreateUserInputType, UserType } from "../user.schema";

export interface UserRepository {
  create: (user: CreateUserInputType) => Promise<UserType>;
  findById: (id: number) => Promise<UserType | null>;
  findByEmail: (email: string) => Promise<UserType | null>;
}
