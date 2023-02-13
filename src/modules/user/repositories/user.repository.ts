import { BlogProvidersType } from "@blogLink/blogLink.schema";
import { CreateUserInputType, UserType } from "@user/user.schema";

export interface UserRepository {
  create: (user: CreateUserInputType) => Promise<UserType>;
  findById: (id: number) => Promise<UserType | null>;
  findByEmail: (email: string) => Promise<UserType | null>;
  updateSubscriptions: ({
    userId,
    subscriptions,
  }: {
    userId: number;
    subscriptions: BlogProvidersType[];
  }) => Promise<UserType>;
}
