import {
  PrivateLinkRepositoryInputType,
  PrivateLinkType,
  PrivateLinkUpdateType,
} from "@privateLink/privateLink.schema";
import { PrivateLinkRepository } from "@privateLink/repositories/privateLink.repository";

export class PrivateLinkRepositoryInMemory implements PrivateLinkRepository {
  links: PrivateLinkType[] = [];

  async create(
    privateLink: PrivateLinkRepositoryInputType
  ): Promise<PrivateLinkType> {
    const newLink = {
      ...privateLink,
      id: this.links.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.links.push(newLink);
    return newLink;
  }

  async findById(id: number): Promise<PrivateLinkType | null> {
    return this.links.find((link) => link.id === id) || null;
  }

  async findBySlug(slug: string): Promise<PrivateLinkType | null> {
    return this.links.find((link) => link.slug === slug) || null;
  }

  async findByUserId(userId: number): Promise<PrivateLinkType[]> {
    return this.links.filter((link) => link.userId === userId);
  }

  async update(privateLink: PrivateLinkUpdateType): Promise<PrivateLinkType> {
    const index = this.links.findIndex((link) => link.id === privateLink.id);

    const updatedLink = {
      ...this.links[index],
      ...privateLink,
      updatedAt: new Date(),
    };

    this.links[index] = updatedLink;
    return updatedLink;
  }

  async delete(id: number): Promise<PrivateLinkType> {
    const index = this.links.findIndex((link) => link.id === id);
    const deletedLink = this.links[index];
    this.links.splice(index, 1);
    return deletedLink;
  }
}
