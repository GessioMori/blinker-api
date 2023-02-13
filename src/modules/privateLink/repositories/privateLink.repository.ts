import {
  PrivateLinkBaseType,
  PrivateLinkRepositoryInputType,
  PrivateLinkServiceInputType,
  PrivateLinkType,
  PrivateLinkUpdateType,
} from "@privateLink/privateLink.schema";

export interface PrivateLinkRepository {
  create: (
    privateLink: PrivateLinkRepositoryInputType
  ) => Promise<PrivateLinkType>;
  findById: (id: number) => Promise<PrivateLinkType | null>;
  findBySlug: (slug: string) => Promise<PrivateLinkType | null>;
  findByUserId: (userId: number) => Promise<PrivateLinkType[]>;
  update: (privateLink: PrivateLinkUpdateType) => Promise<PrivateLinkType>;
  delete: (id: number, userId: number) => Promise<PrivateLinkType>;
}
