import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { PrivateLinkService } from "./privateLink.service";

@injectable()
export class PrivateLinkController {
  constructor(
    @inject("PrivateLinkService")
    private readonly privateLinkService: PrivateLinkService
  ) {}

  async handleCreatePrivateLink(request: Request, response: Response) {
    const { title, url } = request.body;

    const newPrivateLink = await this.privateLinkService.create({
      title,
      url,
      userId: request.session.user.id,
    });

    return response.status(201).json(newPrivateLink);
  }

  async handleGetPrivateLinkById(request: Request, response: Response) {
    const { id } = request.params;

    const privateLink = await this.privateLinkService.findById(Number(id));

    if (!privateLink) {
      return response.status(404).json({ message: "Private link not found" });
    }

    return response.status(200).json(privateLink);
  }

  async handleGetPrivateLinkBySlug(request: Request, response: Response) {
    const { slug } = request.params;

    const privateLink = await this.privateLinkService.findBySlug(slug);

    if (!privateLink) {
      return response.status(404).json({ message: "Private link not found" });
    }

    return response.status(200).json(privateLink);
  }

  async handleGetPrivateLinkByUserId(request: Request, response: Response) {
    const { userId } = request.params;

    const privateLinks = await this.privateLinkService.findByUserId(
      Number(userId)
    );

    return response.status(200).json(privateLinks);
  }

  async handleUpdatePrivateLink(request: Request, response: Response) {
    const { id } = request.params;
    const { title, url } = request.body;

    const privateLink = await this.privateLinkService.update({
      id: Number(id),
      title,
      url,
      userId: request.session.user.id,
    });

    return response.status(200).json(privateLink);
  }

  async handleDeletePrivateLink(request: Request, response: Response) {
    const { id } = request.params;

    await this.privateLinkService.delete(Number(id), request.session.user.id);

    return response.status(204).send();
  }

  async handleRedirectPrivateLink(request: Request, response: Response) {
    const { slug } = request.params;

    const privateLink = await this.privateLinkService.findBySlug(slug);

    if (!privateLink) {
      return response.status(404).json({ message: "Private link not found" });
    }

    return response.redirect(privateLink.url);
  }
}
