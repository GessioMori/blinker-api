import { AppError } from "@/utils/errors/AppError";
import { BlogLinkBaseType } from "@blogLink/blogLink.schema";
import axios from "axios";
import { JSDOM } from "jsdom";

export const tkDodoScraper = async (): Promise<BlogLinkBaseType[]> => {
  const response = await axios({
    url: "https://tkdodo.eu/blog/all",
    method: "GET",
    responseType: "blob",
  });

  if (response.status !== 200) {
    throw new AppError("Error while fetching data from TkDodo", 500);
  }

  const document = new JSDOM(response.data).window.document;

  const links = document.getElementsByClassName("css-smn70y");
  const posts: BlogLinkBaseType[] = [];

  for (let i = 0; i < links.length; i++) {
    const title = links[i].textContent;
    const url = links[i].getAttribute("href");

    if (title && url) {
      posts.push({
        title,
        url: "https://tkdodo.eu/" + url,
        blogName: "TKDODO" as const,
      });
    }
  }

  return posts.reverse();
};
