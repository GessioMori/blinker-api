import { authMiddleware } from "@/utils/middlewares/auth.middleware";
import { Router } from "express";
import { container } from "tsyringe";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { BlogLinkController } from "./blogLink.controller";
import { BlogProviders } from "./blogLink.schema";

const blogLinkRouter = Router();

const blogLinkController = container.resolve(BlogLinkController);

const getBlogLinksByUser =
  blogLinkController.handleGetBlogLinksByUser.bind(blogLinkController);
const getBlogLinksByBlog =
  blogLinkController.handleGetBlogLinksByBlog.bind(blogLinkController);
const redirectBlogLink =
  blogLinkController.handleRedirectBlogLink.bind(blogLinkController);

blogLinkRouter.get("/user", authMiddleware, getBlogLinksByUser);
blogLinkRouter.get(
  "/:slug",
  validateRequest({
    params: z.object({
      slug: z.string(),
    }),
  }),
  redirectBlogLink
);
blogLinkRouter.get(
  "/blog/:blog",
  validateRequest({
    params: z.object({
      blog: BlogProviders,
    }),
  }),
  getBlogLinksByBlog
);

export { blogLinkRouter };
