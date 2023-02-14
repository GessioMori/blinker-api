import "reflect-metadata";
import { BlogLinkController } from "@blogLink/blogLink.controller";
import { container } from "tsyringe";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import { app } from "./app";

const blogLinkController = container.resolve(BlogLinkController);

const handleUpdateLinks =
  blogLinkController.handleUpdateLinks.bind(blogLinkController);

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  /* const scheduler = new ToadScheduler();
  const job = new SimpleIntervalJob(
    { seconds: 3600, runImmediately: true },
    new AsyncTask("Update Links", handleUpdateLinks)
  );
  scheduler.addSimpleIntervalJob(job); */
  console.log(`Server is running on port ${PORT}`);
});
