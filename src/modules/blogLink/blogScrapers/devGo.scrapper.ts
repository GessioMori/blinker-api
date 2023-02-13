import { AppError } from "@/utils/errors/AppError";
import { BlogLinkBaseType } from "@blogLink/blogLink.schema";
import axios from "axios";
import { JSDOM } from "jsdom";

export const devGoScraper = async (): Promise<BlogLinkBaseType[]> => {
  const response = await axios({
    url: "https://devgo.com.br/archive",
    method: "GET",
    responseType: "blob",
  });

  if (response.status !== 200) {
    throw new AppError("Error while fetching data from DEVGO", 500);
  }

  const document = new JSDOM(response.data).window.document;

  const links = document.getElementsByClassName("css-1xasg5t");
  const posts = [];

  for (let i = 0; i < links.length; i++) {
    const title = links[i].textContent;
    const url = links[i].getAttribute("href");
    if (title && url) {
      posts.push({
        title,
        url,
        blogName: "DEVGO" as const,
      });
    }
  }

  return posts.reverse();
};
