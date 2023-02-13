import { Router } from "express";
import { JSDOM } from "jsdom";
import axios from "axios";

const blogLinkRouter = Router();

blogLinkRouter.get("/", async (req, res) => {
  const response = await axios({
    url: "https://devgo.com.br/archive",
    method: "GET",
    responseType: "blob",
  });

  const dom = new JSDOM(response.data).window.document;

  const links = dom.getElementsByClassName("css-1xasg5t");
  const posts = [];

  for (let i = 0; i < links.length; i++) {
    posts.push({
      title: links[i].textContent,
      link: links[i].getAttribute("href"),
    });
  }

  console.log(posts);

  return res.send(links);
});

export { blogLinkRouter };
