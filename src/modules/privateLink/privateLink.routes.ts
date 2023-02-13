import { authMiddleware } from "@/utils/middlewares/auth.middleware";
import { Router } from "express";
import { container } from "tsyringe";
import { PrivateLinkController } from "./privateLink.controller";
import { validateRequest } from "zod-express-middleware";
import {
  PrivateLinkBaseSchema,
  PrivateLinkInputUpdateSchema,
} from "./privateLink.schema";
import { z } from "zod";
import { validateId } from "@/utils/parsers/params";

const privateLinkController = container.resolve(PrivateLinkController);

const privateLinkRouter = Router();

// Handlers

const handleCreatePrivateLink =
  privateLinkController.handleCreatePrivateLink.bind(privateLinkController);
const handleGetPrivateLinkById =
  privateLinkController.handleGetPrivateLinkById.bind(privateLinkController);
const handleGetPrivateLinkByUserId =
  privateLinkController.handleGetPrivateLinkByUserId.bind(
    privateLinkController
  );
const handleUpdatePrivateLink =
  privateLinkController.handleUpdatePrivateLink.bind(privateLinkController);
const handleDeletePrivateLink =
  privateLinkController.handleDeletePrivateLink.bind(privateLinkController);
const handleRedirectPrivateLink =
  privateLinkController.handleRedirectPrivateLink.bind(privateLinkController);

// Routes

privateLinkRouter.get("/user", authMiddleware, handleGetPrivateLinkByUserId);
privateLinkRouter.get("/:slug", handleRedirectPrivateLink);
privateLinkRouter.use(authMiddleware);
privateLinkRouter.post(
  "/",
  validateRequest({
    body: PrivateLinkBaseSchema,
  }),
  handleCreatePrivateLink
);
privateLinkRouter.get(
  "/link/:id",
  validateRequest(validateId),
  handleGetPrivateLinkById
);

privateLinkRouter.put(
  "/:id",
  validateRequest({
    body: PrivateLinkInputUpdateSchema,
    ...validateId,
  }),
  handleUpdatePrivateLink
);
privateLinkRouter.delete(
  "/:id",
  validateRequest(validateId),
  handleDeletePrivateLink
);

export { privateLinkRouter };
