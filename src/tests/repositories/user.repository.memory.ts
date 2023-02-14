import { BlogProvidersType } from "@blogLink/blogLink.schema";
import { UserRepository } from "@user/repositories/user.repository";
import { CreateUserInputType, UserType } from "@user/user.schema";

export class UserRepositoryInMemory implements UserRepository {
  users: UserType[] = [];

  async create(user: CreateUserInputType): Promise<UserType> {
    const newUser = {
      ...user,
      id: this.users.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptions: [],
    };
    this.users.push(newUser);
    return newUser;
  }

  async findByEmail(email: string): Promise<UserType | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findById(id: number): Promise<UserType | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async updateSubscriptions({
    userId,
    subscriptions,
  }: {
    userId: number;
    subscriptions: BlogProvidersType[];
  }): Promise<UserType> {
    const index = this.users.findIndex((user) => user.id === userId);
    const updatedUser = {
      ...this.users[index],
      subscriptions,
      updatedAt: new Date(),
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }
}
