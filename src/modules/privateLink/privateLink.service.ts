import { inject, injectable } from "tsyringe";
import ShortUniqueId from "short-unique-id";
import {
  PrivateLinkServiceInputType,
  PrivateLinkType,
  PrivateLinkUpdateType,
} from "./privateLink.schema";
import { PrivateLinkRepository } from "./repositories/privateLink.repository";
import { AppError } from "@/utils/errors/AppError";

@injectable()
export class PrivateLinkService {
  constructor(
    @inject("PrivateLinkRepository")
    private readonly privateLinkRepository: PrivateLinkRepository
  ) {}

  async create(
    privateLink: PrivateLinkServiceInputType
  ): Promise<PrivateLinkType> {
    const uid = new ShortUniqueId({ length: 10 });

    const slug = uid();

    return await this.privateLinkRepository.create({
      ...privateLink,
      slug,
    });
  }

  async findById(id: number): Promise<PrivateLinkType | null> {
    return await this.privateLinkRepository.findById(id);
  }

  async findBySlug(slug: string): Promise<PrivateLinkType | null> {
    return await this.privateLinkRepository.findBySlug(slug);
  }

  async findByUserId(userId: number): Promise<PrivateLinkType[]> {
    return await this.privateLinkRepository.findByUserId(userId);
  }

  async update(privateLink: PrivateLinkUpdateType): Promise<PrivateLinkType> {
    const privateLinkFound = await this.privateLinkRepository.findById(
      privateLink.id
    );

    if (!privateLinkFound) {
      throw new AppError("Private link not found", 404);
    }

    if (privateLinkFound.userId !== privateLink.userId) {
      throw new AppError(
        "You don't have permission to update this private link",
        403
      );
    }

    return await this.privateLinkRepository.update(privateLink);
  }

  async delete(id: number, userId: number): Promise<PrivateLinkType> {
    const privateLinkFound = await this.privateLinkRepository.findById(id);

    if (!privateLinkFound) {
      throw new AppError("Private link not found", 404);
    }

    if (privateLinkFound.userId !== userId) {
      throw new AppError(
        "You don't have permission to update this private link",
        403
      );
    }

    return await this.privateLinkRepository.delete(id, userId);
  }
}
