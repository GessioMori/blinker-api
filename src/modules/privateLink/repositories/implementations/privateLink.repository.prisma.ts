import prisma from "@/infra/db/prisma";
import {
  PrivateLinkRepositoryInputType,
  PrivateLinkType,
  PrivateLinkUpdateType,
} from "@privateLink/privateLink.schema";

export class PrismaPrivateLinkRepository
  implements PrismaPrivateLinkRepository
{
  async create(
    privateLink: PrivateLinkRepositoryInputType
  ): Promise<PrivateLinkType> {
    return await prisma.privateLink.create({
      data: privateLink,
    });
  }

  async findById(id: number): Promise<PrivateLinkType | null> {
    return await prisma.privateLink.findUnique({
      where: {
        id,
      },
    });
  }

  async findBySlug(slug: string): Promise<PrivateLinkType | null> {
    return await prisma.privateLink.findUnique({
      where: {
        slug,
      },
    });
  }

  async findByUserId(userId: number): Promise<PrivateLinkType[]> {
    return await prisma.privateLink.findMany({
      where: {
        userId,
      },
    });
  }

  async update(privateLink: PrivateLinkUpdateType): Promise<PrivateLinkType> {
    return await prisma.privateLink.update({
      where: {
        id: privateLink.id,
      },
      data: {
        title: privateLink.title,
        url: privateLink.url,
      },
    });
  }

  async delete(id: number): Promise<PrivateLinkType> {
    return await prisma.privateLink.delete({
      where: {
        id,
      },
    });
  }
}
